'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface DeviceData {
  id: string;
  brand: string;
  model: string;
  type: string | null;
  status: string;
  price: number;
  imei: string | null;
  serialNo: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    name: string;
  };
  shop: {
    name: string;
    address: string;
    phone: string | null;
    logoUrl: string | null;
  };
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE:     { label: 'Active',     color: '#0284c7', bg: '#e0f2fe' },
  SOLD:       { label: 'Sold',       color: '#16a34a', bg: '#dcfce7' },
  COLLECTED:  { label: 'Collected',  color: '#16a34a', bg: '#dcfce7' },
};

export default function PublicDeviceInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const [device, setDevice] = useState<DeviceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (!id) return;
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(`${API_BASE}/v1/track/device/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setDevice(json.data);
        else setError(json.message || 'Device details not found.');
      })
      .catch(() => setError('Could not load device details. Please check your connection.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!device) return;
    setIsGeneratingPDF(true);
    try {
      const mappedDevice = {
        id: device.id,
        name: `${device.brand} ${device.model}`,
        brand: device.brand,
        model: device.model,
        type: device.type,
        status: device.status,
        price: device.price,
        imei: device.imei,
        serialNo: device.serialNo,
        createdAt: device.createdAt,
        customer: device.customer,
      };

      await generateDeviceInvoicePDF(mappedDevice, {
        shopName: device.shop.name,
        shopAddress: device.shop.address,
        shopPhone: device.shop.phone,
        shopLogoUrl: device.shop.logoUrl,
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
        <p className="text-slate-500 font-medium text-sm">Loading device receipt details...</p>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-slate-100">
          <div className="text-4xl mb-3">🔍</div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Receipt Not Found</h2>
          <p className="text-slate-500 text-sm mb-4">{error || 'No device details found.'}</p>
          <p className="text-xs text-slate-400 font-mono bg-slate-100 py-1.5 px-3 rounded-lg inline-block">Device ID: {id}</p>
        </div>
      </div>
    );
  }

  const logoSrc = device.shop.logoUrl || '/all-fix-logo-black.png';
  const formattedRef = `#DEV-${device.id.substring(0, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 flex flex-col items-center font-sans">
      
      {/* Action Header */}
      <div className="w-full max-w-[800px] flex justify-between items-center mb-6 shrink-0 sticky top-4 z-50 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
            OFFICIAL DEVICE RECEIPT
          </span>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="h-11 px-6 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs sm:text-sm font-black flex items-center gap-2.5 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {isGeneratingPDF ? 'Generating Device PDF...' : 'Download Device PDF'}
        </button>
      </div>

      {/* Device Paper Canvas */}
      <div className="w-full max-w-[800px] bg-white rounded-[24px] shadow-2xl p-8 sm:p-16 shrink-0 border border-slate-100 flex flex-col min-h-[900px] text-slate-900">
        
        {/* BRANDING HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img src={logoSrc} alt="Shop Logo" className="h-10 w-auto max-h-12 object-contain" />
              <h2 className="text-2xl sm:text-[26px] font-black text-[#0F172A] tracking-tighter uppercase">
                {device.shop.name || 'All Fix Private Limited'}
              </h2>
            </div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              <p>Digital Inventory Asset</p>
              <p>contact@allfix.lk</p>
              <p>{device.shop.phone || '+94 11 234 5678'}</p>
            </div>
          </div>
          <div className="text-left sm:text-right text-[11px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">
            <p className="text-slate-800 font-black">Premium Technical Audits</p>
            <p>{device.shop.address || 'Colombo, Sri Lanka'}</p>
            <p className="text-[#4F46E5] mt-1">VAT REG: 009876543-X</p>
          </div>
        </div>

        {/* LOGISTICS & META GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12">
          <div className="col-span-1 border-l-2 border-[#4F46E5] pl-4">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Owner / Customer</p>
            <p className="text-[14px] font-black text-[#0F172A] mb-1">{device.customer.name}</p>
            <p className="text-[12px] text-slate-500 font-bold leading-relaxed">
              Customer Verified<br />
              Registered Asset
            </p>
          </div>

          <div className="col-span-2 px-0 sm:px-6 sm:border-x border-slate-100">
            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-black">Receipt Reference</p>
                <p className="text-[13px] font-black text-[#0F172A] font-mono bg-slate-50 px-2 py-1 rounded inline-block border border-slate-100">{formattedRef}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-black">Registration Date</p>
                <p className="text-[13px] font-black text-[#0F172A]">{new Date(device.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-black">Asset Specification</p>
                <p className="text-[13px] font-black text-[#0F172A]">{device.brand} {device.model}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-black">Status</p>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md border uppercase inline-block bg-emerald-50 text-emerald-700 border-emerald-200">
                  {device.status}
                </span>
              </div>
            </div>
          </div>

          <div className="col-span-1 text-right bg-slate-50/60 p-5 rounded-2xl border border-slate-100 h-fit">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-black">Asset Valuation</p>
            <p className="text-2xl sm:text-[30px] font-black text-[#0F172A] tracking-tighter leading-none mb-1">
              <span className="text-xs text-slate-400 mr-1">Rs.</span>
              {(device.price || 0).toLocaleString()}
            </p>
            <div className="mt-4 border-t border-slate-200 pt-3">
              <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-0.5 font-black underline decoration-[#4F46E5] underline-offset-4">Asset Type</p>
              <p className="text-[11px] font-black text-[#4F46E5]">{device.type || 'Hardware Device'}</p>
            </div>
          </div>
        </div>

        {/* TRANSACTIONAL DETAIL TABLE */}
        <div className="mt-8 flex-1">
          <div className="grid grid-cols-12 pb-3 mb-6 border-b-2 border-[#0F172A]">
            <div className="col-span-6 text-[11px] text-[#0F172A] uppercase tracking-widest font-black">Item Description</div>
            <div className="col-span-2 text-[11px] text-[#0F172A] uppercase tracking-widest font-black text-center">Unit Qty</div>
            <div className="col-span-2 text-[11px] text-[#0F172A] uppercase tracking-widest font-black text-center">Rate (LKR)</div>
            <div className="col-span-2 text-right text-[11px] text-[#0F172A] uppercase tracking-widest font-black">Subtotal</div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-12 items-center">
              <div className="col-span-6">
                <p className="text-[14px] font-black text-[#0F172A] mb-0.5">{device.brand} {device.model}</p>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  {device.imei ? `IMEI: ${device.imei}` : device.serialNo ? `S/N: ${device.serialNo}` : 'Hardware Item'}
                </p>
              </div>
              <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">1</div>
              <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">Rs. {(device.price || 0).toLocaleString()}</div>
              <div className="col-span-2 text-right text-[13px] font-black text-[#0F172A]">Rs. {(device.price || 0).toLocaleString()}</div>
            </div>
          </div>

          {/* FINANCIAL TOTALS */}
          <div className="flex justify-end pt-10 mt-10 border-t-4 border-slate-50">
            <div className="w-full sm:w-[340px] space-y-4">
              <div className="flex justify-between items-center text-[13px] font-bold text-slate-500 pb-3 border-b border-slate-100">
                <span>Asset Baseline Valuation</span>
                <span className="text-[#0F172A]">Rs. {(device.price || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[15px] font-black text-[#0F172A] uppercase tracking-tighter">Grand Total Billed</span>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#4F46E5] tracking-tighter leading-none">
                    Rs. {(device.price || 0).toLocaleString()}
                  </p>
                  <p className="text-[9px] text-slate-400 font-black uppercase mt-1">Authorized for Transaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-end gap-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <div className="max-w-md">
            <p className="text-[#0F172A] font-black mb-1">Thank you for choosing {device.shop.name} for your technical audits.</p>
            <p className="leading-relaxed">All hardware items include a 1-year manufacturer warranty from the date of purchase.</p>
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
