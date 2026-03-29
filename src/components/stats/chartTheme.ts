/**
 * Shared Chart.js design tokens — matches the new Catafy admin design system.
 * Import from this file in every chart component.
 */

/* ── Brand palette ─────────────────────────────────────── */
export const C = {
  indigo:  '#6366f1',
  indigoA: 'rgba(99,102,241,0.12)',
  green:   '#10b981',
  greenA:  'rgba(16,185,129,0.12)',
  amber:   '#f59e0b',
  amberA:  'rgba(245,158,11,0.12)',
  sky:     '#0ea5e9',
  skyA:    'rgba(14,165,233,0.12)',
  violet:  '#8b5cf6',
  violetA: 'rgba(139,92,246,0.12)',
  red:     '#ef4444',
  redA:    'rgba(239,68,68,0.12)',
  slate:   '#94a3b8',
  grid:    'rgba(148,163,184,0.1)',
};

/* ── Pie / Doughnut palette (6 slices) ─────────────────── */
export const PIE_COLORS = [
  C.indigo, C.green, C.amber, C.sky, C.violet, C.red,
];
export const PIE_COLORS_A = [
  'rgba(99,102,241,0.85)',
  'rgba(16,185,129,0.85)',
  'rgba(245,158,11,0.85)',
  'rgba(14,165,233,0.85)',
  'rgba(139,92,246,0.85)',
  'rgba(239,68,68,0.85)',
];

/* ── Shared axis & tooltip defaults ────────────────────── */
export const TOOLTIP = {
  backgroundColor: '#1e293b',
  titleColor: '#f1f5f9',
  bodyColor: '#94a3b8',
  padding: 10,
  cornerRadius: 8,
  borderColor: 'rgba(255,255,255,0.06)',
  borderWidth: 1,
  displayColors: true,
  boxWidth: 10,
  boxHeight: 10,
};

export const AXIS_X = {
  grid: { display: false },
  ticks: { color: C.slate, font: { size: 11 } },
  border: { display: false },
};

export const AXIS_Y = {
  grid: { color: C.grid },
  ticks: { color: C.slate, font: { size: 11 } },
  border: { display: false },
};

export const LEGEND = {
  display: false, // hide by default; enable per-chart if needed
};

/* ── Full base options (line / bar) ────────────────────── */
export const BASE_OPTIONS: any = {
  responsive: true,
  maintainAspectRatio: true,
  interaction: { mode: 'index' as const, intersect: false },
  plugins: {
    legend: LEGEND,
    tooltip: TOOLTIP,
  },
  scales: {
    x: AXIS_X,
    y: AXIS_Y,
  },
};
