import type { BookingStatus, MoneyValue, PaymentStatus } from './adminApi';

const dateTimeFormatter = new Intl.DateTimeFormat('tr-TR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function formatAdminDateTime(value: string | null | undefined): string {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return dateTimeFormatter.format(parsed);
}

export function formatAdminMoney(value: MoneyValue, currency: string): string {
  const amount = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(amount)) {
    return `${value} ${currency}`;
  }

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function bookingStatusLabel(status: BookingStatus): string {
  switch (status) {
    case 'PENDING':
      return 'Bekliyor';
    case 'CONFIRMED':
      return 'Onaylandi';
    case 'CANCELED':
      return 'Iptal';
    case 'EXPIRED':
      return 'Suresi Doldu';
    default:
      return status;
  }
}

export function paymentStatusLabel(status: PaymentStatus): string {
  switch (status) {
    case 'UNPAID':
      return 'Odenmedi';
    case 'PAID':
      return 'Odendi';
    case 'PARTIAL':
      return 'Kismi';
    default:
      return status;
  }
}

export function bookingStatusClass(status: BookingStatus): string {
  switch (status) {
    case 'PENDING':
      return 'border-amber-400/30 bg-amber-400/10 text-amber-200';
    case 'CONFIRMED':
      return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200';
    case 'CANCELED':
      return 'border-rose-400/30 bg-rose-400/10 text-rose-200';
    case 'EXPIRED':
      return 'border-slate-400/30 bg-slate-400/10 text-slate-200';
    default:
      return 'border-slate-400/30 bg-slate-400/10 text-slate-200';
  }
}

export function paymentStatusClass(status: PaymentStatus): string {
  switch (status) {
    case 'UNPAID':
      return 'border-amber-400/30 bg-amber-400/10 text-amber-200';
    case 'PAID':
      return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200';
    case 'PARTIAL':
      return 'border-sky-400/30 bg-sky-400/10 text-sky-200';
    default:
      return 'border-slate-400/30 bg-slate-400/10 text-slate-200';
  }
}
