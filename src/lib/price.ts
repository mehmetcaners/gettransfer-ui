export type VehicleType = 'economy' | 'minivan' | 'vip-vito' | 'minibus' | 'bus';

export function formatPrice(price: number, locale = 'tr-TR', currency = 'TRY'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price);
}
