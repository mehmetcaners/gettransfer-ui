export type VehicleType = 'economy' | 'minivan' | 'vip-vito' | 'minibus' | 'bus';

const VEHICLE_RATES: Record<VehicleType, { baseRate: number; perKm: number; perPax: number }> = {
  'economy': { baseRate: 500, perKm: 8, perPax: 0 },
  'minivan': { baseRate: 700, perKm: 10, perPax: 20 },
  'vip-vito': { baseRate: 1200, perKm: 15, perPax: 30 },
  'minibus': { baseRate: 1500, perKm: 18, perPax: 15 },
  'bus': { baseRate: 2500, perKm: 25, perPax: 10 },
};

function estimateDistance(from: string, to: string): number {
  const hash = (from + to).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 20 + (hash % 30);
}

export function estimatePrice(params: {
  from: string;
  to: string;
  passengers: number;
  vehicleType: VehicleType;
  roundTrip?: boolean;
}): number {
  const { from, to, passengers, vehicleType, roundTrip = false } = params;
  const rates = VEHICLE_RATES[vehicleType];
  const distance = estimateDistance(from, to);

  const oneWayPrice = rates.baseRate + (rates.perKm * distance) + (rates.perPax * passengers);
  return roundTrip ? oneWayPrice * 1.8 : oneWayPrice;
}

export function formatPrice(price: number, locale = 'tr-TR', currency = 'TRY'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price);
}
