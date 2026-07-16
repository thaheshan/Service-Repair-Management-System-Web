import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Repair Invoice | AllFix',
  description: 'View your repair invoice and service details.',
};

export default function InvoiceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 600px) {
          .invoice-two-col { grid-template-columns: 1fr !important; }
          .invoice-table-wrap { overflow-x: auto; }
        }
      `}</style>
      {children}
    </>
  );
}
