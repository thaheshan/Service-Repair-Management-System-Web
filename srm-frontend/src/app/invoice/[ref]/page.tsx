'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface InvoiceData {
  reference: string;
  status: string;
  issue: string | null;
  diagnosis: string | null;
  estimatedCost: number | null;
  finalCost: number | null;
  createdAt: string;
  updatedAt: string;
  estimatedCompletionDate: string | null;
  customer: { name: string };
  device: { brand: string; model: string; type: string | null; imei: string | null };
  shop: { name: string; address: string; phone: string | null; logoUrl: string | null };
  payment: { amount: number; status: string; method: string; createdAt: string } | null;
  parts: { name: string; quantity: number; unitCost: number }[];
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  NOT_STARTED:    { label: 'Not Started',    color: '#64748b', bg: '#f1f5f9' },
  IN_PROGRESS:    { label: 'In Progress',    color: '#d97706', bg: '#fef3c7' },
  WAITING_PARTS:  { label: 'Waiting Parts',  color: '#9333ea', bg: '#f3e8ff' },
  READY_TO_TAKE:  { label: 'Ready to Collect', color: '#16a34a', bg: '#dcfce7' },
  COMPLETED:      { label: 'Completed',      color: '#16a34a', bg: '#dcfce7' },
  DELIVERED:      { label: 'Delivered',      color: '#0284c7', bg: '#e0f2fe' },
  CANCELLED:      { label: 'Cancelled',      color: '#dc2626', bg: '#fee2e2' },
  PAID:           { label: 'Paid',           color: '#16a34a', bg: '#dcfce7' },
};

export default function PublicInvoicePage() {
  const { ref } = useParams<{ ref: string }>();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(`${API_BASE}/v1/track/${ref}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setInvoice(json.data);
        else setError(json.message || 'Invoice not found.');
      })
      .catch(() => setError('Could not load invoice. Please check your connection.'))
      .finally(() => setLoading(false));
  }, [ref]);

  const handleDownloadPDF = async () => {
    if (!invoice) return;
    setIsGeneratingPDF(true);
    try {
      const partsTotal = (invoice.parts || []).reduce((sum, p) => sum + (p.quantity * p.unitCost), 0);
      const totalAmount = invoice.finalCost ?? invoice.estimatedCost ?? invoice.payment?.amount ?? 0;
      const partsVal = partsTotal > 0 ? partsTotal : totalAmount * 0.6;
      const laborVal = Math.max(0, totalAmount - partsVal);

      const mappedTarget = {
        id: invoice.reference,
        invoiceId: `#REP-${invoice.reference}`,
        type: 'client_repair',
        name: invoice.customer.name,
        phone: invoice.customer.phone || 'N/A',
        amount: totalAmount,
        laborCost: laborVal,
        partsCost: partsVal,
        advancePayment: invoice.advancePayment || 0,
        status: ['PAID', 'COMPLETED', 'DELIVERED'].includes(invoice.status) ? 'Paid' : 'Pending',
        date: invoice.createdAt,
        device: `${invoice.device.brand} ${invoice.device.model}`,
      };

      await generateClientInvoicePDF(mappedTarget, {
        shopName: invoice.shop.name,
        shopAddress: invoice.shop.address,
        shopPhone: invoice.shop.phone,
        shopLogoUrl: invoice.shop.logoUrl,
      });
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Could not generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium text-sm">Loading invoice details...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-slate-100">
          <div className="text-4xl mb-3">🔍</div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Invoice Not Found</h2>
          <p className="text-slate-500 text-sm mb-4">{error || 'No invoice found for this reference.'}</p>
          <p className="text-xs text-slate-400 font-mono bg-slate-100 py-1.5 px-3 rounded-lg inline-block">Reference: #{ref}</p>
        </div>
      </div>
    );
  }

  const partsTotal = (invoice.parts || []).reduce((sum, p) => sum + (p.quantity * p.unitCost), 0);
  const totalAmount = invoice.finalCost ?? invoice.estimatedCost ?? invoice.payment?.amount ?? 0;
  const advancePayment = Number(invoice.advancePayment) || 0;
  const remainingPayable = Math.max(0, totalAmount - advancePayment);

  const partsVal = partsTotal > 0 ? partsTotal : totalAmount * 0.6;
  const laborVal = Math.max(0, totalAmount - partsVal);

  const isPaid = ['PAID', 'COMPLETED', 'DELIVERED'].includes(invoice.status) || (invoice.payment?.status === 'PAID');
  const logoSrc = invoice.shop.logoUrl || '/all-fix-logo-black.png';

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 flex flex-col items-center font-sans">
      
      {/* Sticky Action Header */}
      <div className="w-full max-w-[800px] flex justify-between items-center mb-6 shrink-0 sticky top-4 z-50 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-lg">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
            {isPaid ? 'PAID & VERIFIED' : 'PAYMENT PENDING'}
          </span>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="h-11 px-6 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs sm:text-sm font-black flex items-center gap-2.5 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {isGeneratingPDF ? 'Generating Invoice PDF...' : 'Download PDF Invoice'}
        </button>
      </div>

      {/* Invoice Paper Canvas (Matches Admin Preview Modal Exactly) */}
      <div className="w-full max-w-[800px] bg-white rounded-[24px] shadow-2xl p-8 sm:p-16 shrink-0 border border-slate-100 flex flex-col min-h-[1000px] text-slate-900">
        
        {/* BRANDING HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img src={logoSrc} alt="Shop Logo" className="h-10 w-auto max-h-12 object-contain" />
              <h2 className="text-2xl sm:text-[26px] font-black text-[#0F172A] tracking-tighter uppercase">
                {invoice.shop.name || 'All Fix Private Limited'}
              </h2>
            </div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              <p>Digital Repair Hub</p>
              <p>contact@allfix.lk</p>
              <p>{invoice.shop.phone || '+94 11 234 5678'}</p>
            </div>
          </div>
          <div className="text-left sm:text-right text-[11px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">
            <p className="text-slate-800 font-black">Premium Service Center</p>
            <p>{invoice.shop.address || 'Colombo, Sri Lanka'}</p>
            <p className="text-[#4F46E5] mt-1">VAT REG: 009876543-X</p>
          </div>
        </div>

        {/* LOGISTICS & META GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12">
          <div className="col-span-1 border-l-2 border-[#4F46E5] pl-4">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Billed to,</p>
            <p className="text-[14px] font-black text-[#0F172A] mb-1">{invoice.customer.name}</p>
            <p className="text-[12px] text-slate-500 font-bold leading-relaxed">
              {invoice.customer.phone || 'N/A'}<br />
              Client Address Stored<br />
              Verification Required
            </p>
          </div>

          <div className="col-span-2 px-0 sm:px-6 sm:border-x border-slate-100">
            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-black">Invoice Reference</p>
                <p className="text-[13px] font-black text-[#0F172A] font-mono bg-slate-50 px-2 py-1 rounded inline-block border border-slate-100">#{invoice.reference}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-black">Issue Date</p>
                <p className="text-[13px] font-black text-[#0F172A]">{new Date(invoice.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-black">Service Category</p>
                <p className="text-[13px] font-black text-[#0F172A] capitalize">Client Repair ({invoice.device.brand} {invoice.device.model})</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-black">Current Status</p>
                <span
                  className="text-[10px] font-black px-2 py-0.5 rounded-md border uppercase inline-block"
                  style={{
                    backgroundColor: isPaid ? '#ecfdf5' : '#fffbeb',
                    color: isPaid ? '#047857' : '#b45309',
                    borderColor: isPaid ? '#a7f3d0' : '#fde68a',
                  }}
                >
                  {isPaid ? 'PAID' : 'PENDING'}
                </span>
              </div>
            </div>
          </div>

          <div className="col-span-1 text-right bg-slate-50/60 p-5 rounded-2xl border border-slate-100 h-fit">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-black">Total Payable</p>
            <p className="text-2xl sm:text-[30px] font-black text-[#0F172A] tracking-tighter leading-none mb-1">
              <span className="text-xs text-slate-400 mr-1">Rs.</span>
              {totalAmount.toLocaleString()}
            </p>
            <div className="mt-4 border-t border-slate-200 pt-3">
              <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-0.5 font-black underline decoration-[#4F46E5] underline-offset-4">Due Schedule</p>
              <p className="text-[11px] font-black text-[#4F46E5]">Payable on Receipt</p>
            </div>
          </div>
        </div>

        {/* TRANSACTIONAL DETAIL TABLE */}
        <div className="mt-8 flex-1">
          <div className="grid grid-cols-12 pb-3 mb-6 border-b-2 border-[#0F172A]">
            <div className="col-span-6 text-[11px] text-[#0F172A] uppercase tracking-widest font-black">Transactional Detail</div>
            <div className="col-span-2 text-[11px] text-[#0F172A] uppercase tracking-widest font-black text-center">Unit Qty</div>
            <div className="col-span-2 text-[11px] text-[#0F172A] uppercase tracking-widest font-black text-center">Rate (LKR)</div>
            <div className="col-span-2 text-right text-[11px] text-[#0F172A] uppercase tracking-widest font-black">Subtotal</div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-12 items-center">
              <div className="col-span-6">
                <p className="text-[14px] font-black text-[#0F172A] mb-0.5">Advanced Service Labor</p>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Expert Technical Diagnostics & Repair</p>
              </div>
              <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">1</div>
              <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">Rs. {laborVal.toLocaleString()}</div>
              <div className="col-span-2 text-right text-[13px] font-black text-[#0F172A]">Rs. {laborVal.toLocaleString()}</div>
            </div>

            <div className="grid grid-cols-12 items-center">
              <div className="col-span-6">
                <p className="text-[14px] font-black text-[#0F172A] mb-0.5">Component / Parts Material</p>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">OEM Grade Replacement Parts</p>
              </div>
              <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">1</div>
              <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">Rs. {partsVal.toLocaleString()}</div>
              <div className="col-span-2 text-right text-[13px] font-black text-[#0F172A]">Rs. {partsVal.toLocaleString()}</div>
            </div>
          </div>

          {/* FINANCIAL TOTALS */}
          <div className="flex justify-end pt-10 mt-10 border-t-4 border-slate-50">
            <div className="w-full sm:w-[340px] space-y-4">
              <div className="flex justify-between items-center text-[13px] font-bold text-slate-500 pb-3 border-b border-slate-100">
                <span>Subtotal Net</span>
                <span className="text-[#0F172A]">Rs. {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[13px] font-bold text-slate-500 pb-3 border-b border-slate-100">
                <span>Tax Valuation (VAT 0.0%)</span>
                <span className="text-[#0F172A]">Rs. 0</span>
              </div>
              {advancePayment > 0 && (
                <div className="flex justify-between items-center text-[13px] font-bold text-slate-500 pb-3 border-b border-slate-100">
                  <span>Advance Payment</span>
                  <span className="text-emerald-600 font-bold">- Rs. {advancePayment.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2">
                <span className="text-[15px] font-black text-[#0F172A] uppercase tracking-tighter">Grand Total Billed</span>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#4F46E5] tracking-tighter leading-none">
                    Rs. {remainingPayable.toLocaleString()}
                  </p>
                  <p className="text-[9px] text-slate-400 font-black uppercase mt-1">Authorized for Transaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER & STAMPS */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-end gap-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <div className="max-w-md">
            <p className="text-[#0F172A] font-black mb-1">Thank you for choosing {invoice.shop.name} for your technical needs.</p>
            <p className="leading-relaxed">All repairs are covered under a 30-day functional warranty unless otherwise stated. Hardware sales include a 1-year manufacturer warranty from the date of purchase.</p>
          </div>
          <div className="text-center sm:text-right border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0 w-full sm:w-auto">
            <div className="inline-block border-2 border-dashed border-slate-200 px-6 py-3 rounded-xl mb-1 text-slate-300 font-mono text-[9px]">
              Stamp Required / Authorized Signature
            </div>
            <p className="text-slate-400 font-black">AllFix © {new Date().getFullYear()}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%)',
    padding: '24px 16px 48px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  loadingWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    minHeight: '80vh',
  },
  spinner: {
    width: 40, height: 40,
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #4f46e5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorCard: {
    maxWidth: 480, margin: '120px auto 0', background: '#fff',
    borderRadius: 16, padding: 40, textAlign: 'center',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  header: {
    maxWidth: 720, margin: '0 auto 20px',
    display: 'flex', alignItems: 'center', gap: 16,
    background: '#fff', borderRadius: 16, padding: '20px 24px',
    boxShadow: '0 2px 12px rgba(79,70,229,0.08)',
    borderLeft: '4px solid #4f46e5',
  },
  logo: {
    height: 56, width: 'auto', objectFit: 'contain', borderRadius: 8,
  },
  shopName: {
    margin: 0, fontSize: 20, fontWeight: 700, color: '#1e293b',
  },
  shopMeta: {
    margin: '2px 0 0', fontSize: 13, color: '#64748b',
  },
  card: {
    maxWidth: 720, margin: '0 auto', background: '#fff',
    borderRadius: 20, padding: '28px 24px',
    boxShadow: '0 8px 40px rgba(79,70,229,0.1)',
  },
  topRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12,
  },
  label: {
    fontSize: 11, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.06em',
    textTransform: 'uppercase', marginBottom: 4, margin: '0 0 4px',
  },
  refNo: {
    margin: '4px 0 0', fontSize: 22, fontWeight: 800, color: '#4f46e5',
  },
  badge: {
    display: 'inline-block', padding: '6px 14px', borderRadius: 99,
    fontSize: 13, fontWeight: 600,
  },
  divider: {
    height: 1, background: '#e2e8f0', margin: '20px 0',
  },
  twoCol: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 16,
  },
  value: {
    margin: 0, fontSize: 15, fontWeight: 600, color: '#1e293b',
  },
  sub: {
    margin: '2px 0 0', fontSize: 12, color: '#64748b',
  },
  infoBox: {
    background: '#fafafa', border: '1px solid #e2e8f0',
    borderRadius: 10, padding: '12px 16px', marginBottom: 12,
  },
  infoText: {
    margin: 0, fontSize: 14, color: '#334155', lineHeight: 1.6,
  },
  sectionTitle: {
    fontSize: 11, fontWeight: 700, color: '#94a3b8',
    letterSpacing: '0.08em', textTransform: 'uppercase',
    marginBottom: 10, margin: '0 0 10px',
  },
  table: {
    width: '100%', borderCollapse: 'collapse', fontSize: 13,
  },
  tableHead: {
    background: '#4f46e5',
  },
  th: {
    padding: '10px 12px', color: '#fff', fontWeight: 600,
    textAlign: 'left', fontSize: 12,
  },
  td: {
    padding: '10px 12px', color: '#334155', borderBottom: '1px solid #f1f5f9',
  },
  costBox: {
    background: '#f8fafc', borderRadius: 12, padding: '16px 20px',
  },
  costRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 6, fontSize: 14,
  },
  footer: {
    maxWidth: 720, margin: '24px auto 0',
    textAlign: 'center', color: '#64748b', fontSize: 14,
  },
};
