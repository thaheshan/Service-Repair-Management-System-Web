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

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingWrap}>
          <div style={styles.spinner} />
          <p style={{ color: '#64748b', marginTop: 16 }}>Loading your invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div style={styles.page}>
        <div style={styles.errorCard}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <h2 style={{ color: '#1e293b', marginBottom: 8 }}>Invoice Not Found</h2>
          <p style={{ color: '#64748b' }}>{error || 'No invoice found for this reference.'}</p>
          <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 8 }}>Reference: <strong>{ref}</strong></p>
        </div>
      </div>
    );
  }

  const statusInfo = STATUS_LABELS[invoice.status] || { label: invoice.status, color: '#64748b', bg: '#f1f5f9' };
  const partsTotal = invoice.parts.reduce((sum, p) => sum + (p.quantity * p.unitCost), 0);
  const invoiceTotal = invoice.finalCost ?? invoice.estimatedCost ?? 0;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        {invoice.shop.logoUrl && (
          <img src={invoice.shop.logoUrl} alt="Shop Logo" style={styles.logo} />
        )}
        <div>
          <h1 style={styles.shopName}>{invoice.shop.name}</h1>
          {invoice.shop.address && <p style={styles.shopMeta}>{invoice.shop.address}</p>}
          {invoice.shop.phone && <p style={styles.shopMeta}>📞 {invoice.shop.phone}</p>}
        </div>
      </div>

      {/* Invoice Card */}
      <div style={styles.card}>
        {/* Top row */}
        <div style={styles.topRow}>
          <div>
            <p style={styles.label}>INVOICE / REPAIR REFERENCE</p>
            <h2 style={styles.refNo}>#{invoice.reference}</h2>
          </div>
          <span style={{ ...styles.badge, color: statusInfo.color, background: statusInfo.bg }}>
            {statusInfo.label}
          </span>
        </div>

        <div style={styles.divider} />

        {/* Customer & Device */}
        <div style={styles.twoCol}>
          <div>
            <p style={styles.label}>CUSTOMER</p>
            <p style={styles.value}>{invoice.customer.name}</p>
          </div>
          <div>
            <p style={styles.label}>DEVICE</p>
            <p style={styles.value}>{invoice.device.brand} {invoice.device.model}</p>
            {invoice.device.type && <p style={styles.sub}>{invoice.device.type}</p>}
            {invoice.device.imei && <p style={styles.sub}>IMEI: {invoice.device.imei}</p>}
          </div>
        </div>

        <div style={styles.twoCol}>
          <div>
            <p style={styles.label}>DATE CREATED</p>
            <p style={styles.value}>{new Date(invoice.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          {invoice.estimatedCompletionDate && (
            <div>
              <p style={styles.label}>EST. COMPLETION</p>
              <p style={styles.value}>{new Date(invoice.estimatedCompletionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          )}
        </div>

        {/* Issue & Diagnosis */}
        {invoice.issue && (
          <div style={styles.infoBox}>
            <p style={styles.label}>REPORTED ISSUE</p>
            <p style={styles.infoText}>{invoice.issue}</p>
          </div>
        )}
        {invoice.diagnosis && (
          <div style={{ ...styles.infoBox, background: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <p style={{ ...styles.label, color: '#16a34a' }}>TECHNICIAN DIAGNOSIS</p>
            <p style={styles.infoText}>{invoice.diagnosis}</p>
          </div>
        )}

        {/* Parts Table */}
        {invoice.parts.length > 0 && (
          <>
            <div style={styles.divider} />
            <p style={styles.sectionTitle}>PARTS USED</p>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.th}>Part Name</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Qty</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Unit (LKR)</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Total (LKR)</th>
                </tr>
              </thead>
              <tbody>
                {invoice.parts.map((p, i) => (
                  <tr key={i} style={i % 2 === 0 ? {} : { background: '#f8fafc' }}>
                    <td style={styles.td}>{p.name}</td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>{p.quantity}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>Rs. {p.unitCost.toLocaleString()}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>Rs. {(p.quantity * p.unitCost).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Cost Summary */}
        <div style={styles.divider} />
        <div style={styles.costBox}>
          {invoice.estimatedCost && (
            <div style={styles.costRow}>
              <span style={{ color: '#64748b' }}>Estimated Cost</span>
              <span style={{ color: '#64748b' }}>Rs. {invoice.estimatedCost.toLocaleString()}</span>
            </div>
          )}
          {invoice.parts.length > 0 && (
            <div style={styles.costRow}>
              <span style={{ color: '#64748b' }}>Parts Subtotal</span>
              <span style={{ color: '#64748b' }}>Rs. {partsTotal.toLocaleString()}</span>
            </div>
          )}
          <div style={{ ...styles.costRow, marginTop: 8, paddingTop: 12, borderTop: '2px solid #e2e8f0' }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#1e293b' }}>Total Amount</span>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#4f46e5' }}>Rs. {invoiceTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Status */}
        {invoice.payment && (
          <>
            <div style={styles.divider} />
            <div style={styles.twoCol} className="invoice-two-col">
              <div>
                <p style={styles.label}>PAYMENT STATUS</p>
                <span style={{
                  ...styles.badge,
                  color: invoice.payment.status === 'PAID' ? '#16a34a' : '#d97706',
                  background: invoice.payment.status === 'PAID' ? '#dcfce7' : '#fef3c7',
                }}>
                  {invoice.payment.status}
                </span>
              </div>
              <div>
                <p style={styles.label}>PAYMENT METHOD</p>
                <p style={styles.value}>{invoice.payment.method}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p>Thank you for trusting <strong>{invoice.shop.name}</strong> with your device.</p>
        <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
          This is an electronically generated invoice. Reference: {invoice.reference}
        </p>
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
