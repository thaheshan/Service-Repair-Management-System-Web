// SRM Design Tokens — matches srm-frontend/src/app/globals.css exactly
export const C = {
  // Background
  bg: '#F9FAFB',
  card: '#FFFFFF',
  // Text
  fg: '#0F172A',
  fgMuted: '#64748B',
  fgLight: '#94A3B8',
  // Primary (Indigo)
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  primaryMid: '#A5B4FC',
  primaryFg: '#FFFFFF',
  // Borders & Inputs
  border: '#E2E8F0',
  input: '#E2E8F0',
  // Muted
  muted: '#F1F5F9',
  // Status
  success: '#10B981',
  successBg: '#ECFDF5',
  successText: '#065F46',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  warningText: '#92400E',
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  dangerText: '#991B1B',
  info: '#3B82F6',
  infoBg: '#DBEAFE',
  infoText: '#1E40AF',
  // Sidebar
  sidebar: '#FFFFFF',
  sidebarFg: '#64748B',
  sidebarBorder: '#E2E8F0',
  // Misc
  amber50: '#FFFBEB',
  amber700: '#92400E',
};

export const R = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 20,
  card: 16,
};

export const F = {
  xs: 11,
  sm: 12,
  md: 13,
  base: 14,
  lg: 15,
  xl: 16,
  '2xl': 18,
  '3xl': 22,
  '4xl': 24,
  '5xl': 28,
};

export const STATUS: Record<string, { bg: string; text: string; label: string }> = {
  NOT_STARTED: { bg: '#FEF3C7', text: '#92400E', label: 'Pending' },
  PENDING:     { bg: '#FEF3C7', text: '#92400E', label: 'Pending' },
  IN_PROGRESS: { bg: '#DBEAFE', text: '#1E40AF', label: 'In Progress' },
  READY_TO_TAKE: { bg: '#D1FAE5', text: '#065F46', label: 'Ready' },
  COMPLETED:   { bg: '#D1FAE5', text: '#065F46', label: 'Completed' },
  CANCELLED:   { bg: '#FEE2E2', text: '#991B1B', label: 'Cancelled' },
};
