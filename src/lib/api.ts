import type { VehicleType } from './price';

const baseUrl = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';
const defaultCurrency = import.meta.env.VITE_DEFAULT_CURRENCY;

export interface PlaceSelection {
  placeId: string;
  description: string;
}

export interface SearchRequestPayload {
  from: PlaceSelection;
  to: PlaceSelection;
  datetime: string;
  passengers: number;
  roundTrip?: boolean;
  returnDatetime?: string;
}

export interface SearchResult {
  id: string;
  type: VehicleType;
  name: string;
  price: number;
  priceOneWay?: number;
  priceTotal?: number;
  currency: string;
  imageUrl?: string;
  vehicleTypeId?: string | number;
  categoryId?: number;
  seats?: number;
  bags?: number;
  routeUrl?: string;
  priceOptions?: { currency: string; amount: number }[];
  capacity: {
    passengers: number;
    luggage: number;
  };
  features: string[];
  provider?: string;
  etaMin?: number;
}

export interface SearchSummary {
  distanceKm?: number;
  durationMin?: number;
}

export interface SearchResponse extends SearchSummary {
  results: SearchResult[];
}

export interface PlaceSuggestion {
  placeId: string;
  mainText: string;
  secondaryText?: string;
  description: string;
  types?: string[];
}

export interface BookingPayload extends SearchRequestPayload {
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  phone: string;
  vehicleType: VehicleType;
  vehicleId?: string;
  vehicleTypeId?: string | number;
  vehicleName?: string;
  price?: number;
  priceOneWay?: number;
  priceTotal?: number;
  currency?: string;
  seats?: number;
  bags?: number;
  routeUrl?: string;
  notes?: string;
}

const defaultHeaders = {
  'Content-Type': 'application/json',
};

async function handleResponse<T = unknown>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const detail =
      typeof payload === 'string'
        ? payload
        : (payload as { detail?: string; message?: string; error?: string })?.detail ??
          (payload as { detail?: string; message?: string; error?: string })?.message ??
          (payload as { detail?: string; message?: string; error?: string })?.error;
    throw new Error(detail || `Request failed with status ${response.status}`);
  }

  return payload as T;
}

const safeId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

const normaliseVehicleType = (value?: string): VehicleType => {
  const key = (value ?? '').toLowerCase();
  if (key.includes('vip') || key.includes('vito') || key.includes('lux')) return 'vip-vito';
  if (key.includes('mini') && key.includes('bus')) return 'minibus';
  if (key.includes('bus')) return 'bus';
  if (key.includes('van')) return 'minivan';
  if (key.includes('sprinter')) return 'minibus';
  return 'economy';
};

function normaliseSearchResponse(payload: unknown): SearchResponse {
  const container = typeof payload === 'object' && payload !== null ? (payload as Record<string, unknown>) : {};
  const items = Array.isArray(container.results)
    ? container.results
    : Array.isArray(payload)
      ? (payload as unknown[])
      : [];

  const results = items
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const raw = item as Record<string, unknown>;
      const passengers = toNumber(raw.seats) ?? 4;
      const luggage = toNumber(raw.bags) ?? Math.max(2, Math.floor(passengers / 2));
      const priceOneWay = toNumber(raw.price_one_way ?? raw.priceOneWay ?? raw.price) ?? 0;
      const priceTotal = toNumber(raw.price_total ?? raw.priceTotal) ?? priceOneWay;
      const currency = String((raw.currency ?? defaultCurrency ?? 'TRY') as string).toUpperCase();
      const vehicleName = String((raw.vehicle_type ?? raw.name ?? 'Transfer') as string);
      const vehicleTypeId = (raw.vehicle_type_id ?? raw.vehicleTypeId ?? raw.vehicleId) as string | number | undefined;
      const categoryId = (raw.category_id ?? raw.categoryId) as number | undefined;
      const imageUrl = (raw.image_url ?? raw.imageUrl) as string | undefined;
      const routeUrl = typeof raw.route_url === 'string' ? raw.route_url : undefined;

      const idParts = [vehicleTypeId, currency, categoryId].filter(Boolean).map(String);
      const id = idParts.length ? idParts.join('-') : safeId();

      return {
        id,
        type: normaliseVehicleType(vehicleName),
        name: vehicleName,
        price: priceTotal,
        priceOneWay,
        priceTotal,
        currency,
        imageUrl,
        vehicleTypeId,
        categoryId,
        seats: passengers,
        bags: luggage,
        routeUrl,
        priceOptions: [{ currency, amount: priceTotal }],
        capacity: {
          passengers,
          luggage,
        },
        features: [],
        provider: routeUrl,
        etaMin: undefined,
      } satisfies SearchResult;
    })
    .filter(Boolean) as SearchResult[];

  return {
    results,
    distanceKm: toNumber(container.distance_km ?? container.distanceKm),
    durationMin: toNumber(container.duration_min ?? container.durationMin),
  };
}

export async function searchTransfers(payload: SearchRequestPayload): Promise<SearchResponse> {
  const url = new URL(`${baseUrl}/api/transfers/search`);
  url.searchParams.set('from_placeid', payload.from.placeId);
  url.searchParams.set('to_placeid', payload.to.placeId);
  url.searchParams.set('pax', String(payload.passengers));
  url.searchParams.set('roundtrip', String(Boolean(payload.roundTrip)));
  if (defaultCurrency) {
    url.searchParams.set('currency', defaultCurrency);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: defaultHeaders,
  });

  const data = await handleResponse(response);
  return normaliseSearchResponse(data);
}

export async function fetchPlaceSuggestions(query: string, signal?: AbortSignal): Promise<PlaceSuggestion[]> {
  if (!query.trim()) return [];

  const url = new URL(`${baseUrl}/api/places`);
  url.searchParams.set('q', query);
  url.searchParams.set('limit', '8');
  const response = await fetch(url, { signal });
  const data = await handleResponse<Array<Record<string, unknown>>>(response);

  return data.map((item) => ({
    placeId: String(item.place_id ?? item.placeId ?? safeId()),
    mainText: String(item.main_text ?? item.mainText ?? item.description ?? ''),
    secondaryText: item.secondary_text as string | undefined ?? item.secondaryText as string | undefined,
    description: String(item.description ?? item.main_text ?? ''),
    types: Array.isArray(item.types) ? (item.types as string[]) : undefined,
  }));
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'EXPIRED';

export interface BookingResponse {
  id: string;
  pnrCode?: string;
  voucherNo?: string;
  status?: BookingStatus;
  confirmUrl?: string;
  confirmPath?: string;
  confirmToken?: string | null;
  voucherUrl?: string;
}

export interface BookingConfirmResult {
  bookingId: string;
  status: BookingStatus;
  confirmedAt?: string;
}

const absoluteUrl = (url: string) => {
  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return url;
  }
};

const parseConfirmUrl = (url?: string | null) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return {
      bookingId: parsed.searchParams.get('booking_id'),
      token: parsed.searchParams.get('token'),
      path: parsed.pathname + parsed.search,
      url: parsed.toString(),
    };
  } catch {
    return null;
  }
};

const buildVoucherUrl = (bookingId: string) => `${baseUrl}/api/bookings/${bookingId}/voucher.pdf`;

const normaliseBookingResponse = (raw: Record<string, unknown>): BookingResponse => {
  const id = String(raw.id ?? raw.booking_id ?? raw.bookingId ?? '');
  const confirmRaw = (raw.confirm_url ?? raw.confirmUrl) as string | undefined;
  const voucherRaw = (raw.voucher_pdf_url ?? raw.voucherPdfUrl) as string | undefined;
  const parsedConfirm = parseConfirmUrl(confirmRaw);

  return {
    id,
    pnrCode: (raw.pnr_code ?? raw.pnrCode) as string | undefined,
    voucherNo: (raw.voucher_no ?? raw.voucherNo) as string | undefined,
    status: (raw.status as BookingStatus | undefined) ?? 'PENDING',
    confirmUrl: parsedConfirm?.url ?? confirmRaw,
    confirmPath: parsedConfirm?.path,
    confirmToken: parsedConfirm?.token ?? null,
    voucherUrl: voucherRaw ? absoluteUrl(voucherRaw) : id ? buildVoucherUrl(id) : undefined,
  };
};

export async function createBooking(payload: BookingPayload): Promise<BookingResponse> {
  const vehicleTypeId = toNumber(payload.vehicleTypeId ?? payload.vehicleId);
  if (!vehicleTypeId) {
    throw new Error('Araç tipi bilgisi eksik.');
  }

  const seats = payload.seats ?? payload.passengers ?? 1;
  const bags = payload.bags ?? Math.max(1, Math.floor(seats / 2));
  const roundtrip = Boolean(payload.roundTrip);
  const currency = String((payload.currency ?? defaultCurrency ?? 'TRY') as string).toUpperCase();
  const basePrice = payload.priceOneWay ?? (roundtrip ? (payload.price ?? 0) / 2 : payload.price ?? 0);

  const body = {
    from_placeid: payload.from.placeId,
    to_placeid: payload.to.placeId,
    from_text: payload.from.description,
    to_text: payload.to.description,
    route_url: payload.routeUrl ?? payload.vehicleName ?? undefined,
    pickup_datetime: payload.datetime,
    roundtrip,
    pax: payload.passengers,
    vehicle_type_id: vehicleTypeId,
    vehicle_name_snapshot: payload.vehicleName ?? payload.vehicleType,
    seats_snapshot: seats,
    bags_snapshot: bags,
    currency,
    base_price: basePrice,
    extras: [],
    payment_method: 'CASH_TO_DRIVER',
    first_name: payload.firstName,
    last_name: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    note: payload.notes,
  };

  const response = await fetch(`${baseUrl}/api/bookings`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(body),
  });

  const data = await handleResponse<Record<string, unknown>>(response);
  return normaliseBookingResponse(data);
}

export async function confirmBooking(bookingId: string, token: string): Promise<BookingConfirmResult> {
  const url = new URL(`${baseUrl}/api/bookings/${bookingId}/confirm`);
  url.searchParams.set('token', token);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: defaultHeaders,
  });

  const data = await handleResponse<Record<string, unknown>>(response);
  return {
    bookingId: String(data.booking_id ?? bookingId),
    status: (data.status as BookingStatus | undefined) ?? 'CONFIRMED',
    confirmedAt: data.confirmed_at as string | undefined,
  };
}

export { buildVoucherUrl };
