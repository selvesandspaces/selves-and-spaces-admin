export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const inr = (fractionDigits) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
const inrWhole = inr(0);
const inrPrecise = inr(2);

// Whole amounts print without decimals (₹500); anything else keeps paise (₹499.50).
export function formatCurrency(amount) {
  const rounded = Math.round(Number(amount) * 100) / 100;
  return Number.isInteger(rounded) ? inrWhole.format(rounded) : inrPrecise.format(rounded);
}

// Add money values without float drift (0.1 + 0.2): round to paise after each step.
export function addMoney(a, b) {
  return Math.round((a + b) * 100) / 100;
}

// One locale and timezone for every date, so server-rendered and hydrated text always match.
const DATE_OPTS = { timeZone: 'Asia/Kolkata' };

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    ...DATE_OPTS,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString('en-IN', {
    ...DATE_OPTS,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const AVATAR_COLORS = [
  'bg-sage text-white',
  'bg-moss text-white',
  'bg-lavender text-white',
  'bg-brown text-white',
  'bg-forest text-white',
];

export function avatarColor(name) {
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateStr);
}

// Orders use UUIDs; show the first block as a short reference.
export function shortId(id) {
  return String(id ?? '').slice(0, 8).toUpperCase();
}
