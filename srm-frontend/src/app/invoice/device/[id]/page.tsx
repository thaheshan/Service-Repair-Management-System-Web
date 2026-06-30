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

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingWrap}>
          <div style={styles.spinner} />
          <p style={{ color: '#64748b', marginTop: 16 }}>Loading device details...</p>
        </div>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div style={styles.page}>
        <div style={styles.errorCard}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <h2 style={{ color: '#1e293b', marginBottom: 8 }}>Receipt Not Found</h2>
          <p style={{ color: '#64748b' }}>{error || 'No device details found.'}</p>
          <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 8 }}>Device ID: <strong>{id}</strong></p>
        </div>
      </div>
    );
  }

  const statusInfo = STATUS_LABELS[device.status] || { label: device.status, color: '#64748b', bg: '#f1f5f9' };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        {device.shop.logoUrl && (
          <img src={device.shop.logoUrl} alt="Shop Logo" style={styles.logo} />
        )}
        <div>
          <h1 style={styles.shopName}>{device.shop.name}</h1>
          {device.shop.address && <p style={styles.shopMeta}>{device.shop.address}</p>}
          {device.shop.phone && <p style={styles.shopMeta}>📞 {device.shop.phone}</p>}
        </div>
      </div>

      {/* Invoice Card */}
      <div style={styles.card}>
        {/* Top row */}
        <div style={styles.topRow}>
          <div>
            <p style={styles.label}>DEVICE INVOICE / RECEIPT</p>
            <h2 style={styles.refNo}>#{device.id.slice(0, 8).toUpperCase()}</h2>
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
            <p style={styles.value}>{device.customer.name}</p>
          </div>
          <div>
            <p style={styles.label}>DEVICE</p>
            <p style={styles.value}>{device.brand} {device.model}</p>
            {device.type && <p style={styles.sub}>{device.type}</p>}
            {device.imei && <p style={styles.sub}>IMEI: {device.imei}</p>}
            {device.serialNo && <p style={styles.sub}>Serial No: {device.serialNo}</p>}
          </div>
        </div>

        <div style={styles.twoCol}>
          <div>
            <p style={styles.label}>DATE REGISTERED</p>
            <p style={styles.value}>{new Date(device.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div>
            <p style={styles.label}>DATE UPDATED</p>
            <p style={styles.value}>{new Date(device.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Cost Summary */}
        <div style={styles.divider} />
        <div style={styles.costBox}>
          <div style={{ ...styles.costRow, marginTop: 8, paddingTop: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#1e293b' }}>Price / Value</span>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#4f46e5' }}>Rs. {device.price.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p>Thank you for trusting <strong>{device.shop.name}</strong> with your device needs.</p>
        <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
          This is an electronically generated receipt. Reference ID: {device.id}
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
