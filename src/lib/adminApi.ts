const baseUrl = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

type JsonRecord = Record<string, unknown>;

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'EXPIRED';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'PARTIAL';
export type MoneyValue = number | string;

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface AdminLoginResponse {
  accessToken: string;
  tokenType: string;
  admin: AdminUser;
}

export interface AdminBookingListItem {
  id: string;
  pnrCode: string;
  voucherNo: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pickupDatetime: string;
  vehicleName: string;
  totalPrice: MoneyValue;
  currency: string;
  createdAt: string;
}

export interface AdminBookingExtra {
  id: string;
  code: string;
  title: string;
  price: MoneyValue;
  currency: string;
}

export interface AdminBookingDetailData {
  id: string;
  pnrCode: string;
  voucherNo: string;
  status: BookingStatus;
  fromPlaceId: string;
  toPlaceId: string;
  fromText: string;
  toText: string;
  routeUrl: string | null;
  pickupDatetime: string;
  roundTrip: boolean;
  passengers: number;
  vehicleTypeId: number;
  vehicleName: string;
  seats: number;
  bags: number;
  currency: string;
  basePriceOneWay: MoneyValue;
  basePriceTotal: MoneyValue;
  extrasTotal: MoneyValue;
  totalPrice: MoneyValue;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  flightCode: string | null;
  note: string | null;
  confirmExpiresAt: string;
  createdAt: string;
  confirmedAt: string | null;
  canceledAt: string | null;
  extras: AdminBookingExtra[];
  voucherPdfUrl: string;
}

export interface AdminDashboardStats {
  total: number;
  pending: number;
  confirmed: number;
  canceled: number;
  expired: number;
  unpaid: number;
  paid: number;
  partial: number;
}

export type AdminRevenuePeriod = 'day' | 'week' | 'month';

export interface AdminRevenueTotal {
  currency: string;
  amount: MoneyValue;
}

export interface AdminRevenueWindow {
  period: AdminRevenuePeriod;
  label: string;
  timezone: string;
  startAt: string;
  endAt: string;
  confirmedBookings: number;
  totals: AdminRevenueTotal[];
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;
  revenue: AdminRevenueWindow[];
  recentBookings: AdminBookingListItem[];
}

export interface AdminBookingListResponse {
  items: AdminBookingListItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface AdminBookingUpdatePayload {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  note?: string | null;
}

export interface AdminDistancePriceTier {
  id: number;
  minKm: MoneyValue;
  maxKm: MoneyValue;
  price: MoneyValue;
  currency: string;
  isActive: boolean;
}

export interface AdminDistancePriceTierListResponse {
  items: AdminDistancePriceTier[];
}

export interface AdminDistancePriceTierUpsertPayload {
  minKm: string;
  maxKm: string;
  price: string;
  currency: string;
  isActive: boolean;
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

function authHeaders(token: string) {
  return {
    ...defaultHeaders,
    Authorization: `Bearer ${token}`,
  };
}

function toMoneyValue(value: unknown): MoneyValue {
  if (typeof value === 'number' || typeof value === 'string') {
    return value;
  }
  return 0;
}

function toNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function normaliseAdminUser(payload: JsonRecord): AdminUser {
  return {
    id: String(payload.id ?? ''),
    username: String(payload.username ?? ''),
    email: String(payload.email ?? ''),
    role: String(payload.role ?? ''),
    isActive: Boolean(payload.is_active ?? payload.isActive),
    createdAt: String(payload.created_at ?? payload.createdAt ?? ''),
    lastLoginAt:
      typeof payload.last_login_at === 'string'
        ? payload.last_login_at
        : typeof payload.lastLoginAt === 'string'
          ? payload.lastLoginAt
          : null,
  };
}

function normaliseBookingListItem(payload: JsonRecord): AdminBookingListItem {
  return {
    id: String(payload.id ?? ''),
    pnrCode: String(payload.pnr_code ?? payload.pnrCode ?? ''),
    voucherNo: String(payload.voucher_no ?? payload.voucherNo ?? ''),
    status: String(payload.status ?? 'PENDING') as BookingStatus,
    paymentStatus: String(payload.payment_status ?? payload.paymentStatus ?? 'UNPAID') as PaymentStatus,
    firstName: String(payload.first_name ?? payload.firstName ?? ''),
    lastName: String(payload.last_name ?? payload.lastName ?? ''),
    email: String(payload.email ?? ''),
    phone: String(payload.phone ?? ''),
    pickupDatetime: String(payload.pickup_datetime ?? payload.pickupDatetime ?? ''),
    vehicleName: String(payload.vehicle_name_snapshot ?? payload.vehicleName ?? ''),
    totalPrice: toMoneyValue(payload.total_price ?? payload.totalPrice ?? 0),
    currency: String(payload.currency ?? 'TRY'),
    createdAt: String(payload.created_at ?? payload.createdAt ?? ''),
  };
}

function normaliseBookingExtra(payload: JsonRecord): AdminBookingExtra {
  return {
    id: String(payload.id ?? ''),
    code: String(payload.code ?? ''),
    title: String(payload.title ?? ''),
    price: toMoneyValue(payload.price ?? 0),
    currency: String(payload.currency ?? 'TRY'),
  };
}

function normaliseDistancePriceTier(payload: JsonRecord): AdminDistancePriceTier {
  return {
    id: toNumber(payload.id),
    minKm: toMoneyValue(payload.min_km ?? payload.minKm ?? 0),
    maxKm: toMoneyValue(payload.max_km ?? payload.maxKm ?? 0),
    price: toMoneyValue(payload.price ?? 0),
    currency: String(payload.currency ?? 'EUR'),
    isActive: Boolean(payload.is_active ?? payload.isActive),
  };
}

function normaliseRevenueWindow(payload: JsonRecord): AdminRevenueWindow {
  const totals = Array.isArray(payload.totals)
    ? payload.totals.map((item) => ({
        currency: String((item as JsonRecord).currency ?? 'TRY'),
        amount: toMoneyValue((item as JsonRecord).amount ?? 0),
      }))
    : [];

  return {
    period: String(payload.period ?? 'day') as AdminRevenuePeriod,
    label: String(payload.label ?? ''),
    timezone: String(payload.timezone ?? ''),
    startAt: String(payload.start_at ?? payload.startAt ?? ''),
    endAt: String(payload.end_at ?? payload.endAt ?? ''),
    confirmedBookings: toNumber(payload.confirmed_bookings ?? payload.confirmedBookings ?? 0),
    totals,
  };
}

function normaliseBookingDetail(payload: JsonRecord): AdminBookingDetailData {
  const extras = Array.isArray(payload.extras)
    ? payload.extras.map((item) => normaliseBookingExtra(item as JsonRecord))
    : [];

  return {
    id: String(payload.id ?? ''),
    pnrCode: String(payload.pnr_code ?? payload.pnrCode ?? ''),
    voucherNo: String(payload.voucher_no ?? payload.voucherNo ?? ''),
    status: String(payload.status ?? 'PENDING') as BookingStatus,
    fromPlaceId: String(payload.from_placeid ?? payload.fromPlaceId ?? ''),
    toPlaceId: String(payload.to_placeid ?? payload.toPlaceId ?? ''),
    fromText: String(payload.from_text ?? payload.fromText ?? ''),
    toText: String(payload.to_text ?? payload.toText ?? ''),
    routeUrl:
      typeof payload.route_url === 'string'
        ? payload.route_url
        : typeof payload.routeUrl === 'string'
          ? payload.routeUrl
          : null,
    pickupDatetime: String(payload.pickup_datetime ?? payload.pickupDatetime ?? ''),
    roundTrip: Boolean(payload.roundtrip ?? payload.roundTrip),
    passengers: toNumber(payload.pax ?? payload.passengers ?? 0),
    vehicleTypeId: toNumber(payload.vehicle_type_id ?? payload.vehicleTypeId ?? 0),
    vehicleName: String(payload.vehicle_name_snapshot ?? payload.vehicleName ?? ''),
    seats: toNumber(payload.seats_snapshot ?? payload.seats ?? 0),
    bags: toNumber(payload.bags_snapshot ?? payload.bags ?? 0),
    currency: String(payload.currency ?? 'TRY'),
    basePriceOneWay: toMoneyValue(payload.base_price_one_way ?? payload.basePriceOneWay ?? 0),
    basePriceTotal: toMoneyValue(payload.base_price_total ?? payload.basePriceTotal ?? 0),
    extrasTotal: toMoneyValue(payload.extras_total ?? payload.extrasTotal ?? 0),
    totalPrice: toMoneyValue(payload.total_price ?? payload.totalPrice ?? 0),
    paymentMethod: String(payload.payment_method ?? payload.paymentMethod ?? ''),
    paymentStatus: String(payload.payment_status ?? payload.paymentStatus ?? 'UNPAID') as PaymentStatus,
    firstName: String(payload.first_name ?? payload.firstName ?? ''),
    lastName: String(payload.last_name ?? payload.lastName ?? ''),
    email: String(payload.email ?? ''),
    phone: String(payload.phone ?? ''),
    flightCode:
      typeof payload.flight_code === 'string'
        ? payload.flight_code
        : typeof payload.flightCode === 'string'
          ? payload.flightCode
          : null,
    note:
      typeof payload.note === 'string'
        ? payload.note
        : payload.note === null
          ? null
          : null,
    confirmExpiresAt: String(payload.confirm_expires_at ?? payload.confirmExpiresAt ?? ''),
    createdAt: String(payload.created_at ?? payload.createdAt ?? ''),
    confirmedAt:
      typeof payload.confirmed_at === 'string'
        ? payload.confirmed_at
        : typeof payload.confirmedAt === 'string'
          ? payload.confirmedAt
          : null,
    canceledAt:
      typeof payload.canceled_at === 'string'
        ? payload.canceled_at
        : typeof payload.canceledAt === 'string'
          ? payload.canceledAt
          : null,
    extras,
    voucherPdfUrl: String(payload.voucher_pdf_url ?? payload.voucherPdfUrl ?? ''),
  };
}

export async function adminLogin(username: string, password: string): Promise<AdminLoginResponse> {
  const response = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({ username, password }),
  });
  const payload = await handleResponse<JsonRecord>(response);

  return {
    accessToken: String(payload.access_token ?? payload.accessToken ?? ''),
    tokenType: String(payload.token_type ?? payload.tokenType ?? 'Bearer'),
    admin: normaliseAdminUser((payload.admin ?? {}) as JsonRecord),
  };
}

export async function fetchAdminMe(token: string): Promise<AdminUser> {
  const response = await fetch(`${baseUrl}/api/admin/auth/me`, {
    headers: authHeaders(token),
  });
  const payload = await handleResponse<JsonRecord>(response);
  return normaliseAdminUser(payload);
}

export async function fetchAdminDashboard(token: string): Promise<AdminDashboardData> {
  const response = await fetch(`${baseUrl}/api/admin/dashboard`, {
    headers: authHeaders(token),
  });
  const payload = await handleResponse<JsonRecord>(response);
  const stats = (payload.stats ?? {}) as JsonRecord;
  const revenue = Array.isArray(payload.revenue)
    ? payload.revenue.map((item) => normaliseRevenueWindow(item as JsonRecord))
    : [];
  const recentBookings = Array.isArray(payload.recent_bookings)
    ? payload.recent_bookings.map((item) => normaliseBookingListItem(item as JsonRecord))
    : [];

  return {
    stats: {
      total: toNumber(stats.total),
      pending: toNumber(stats.pending),
      confirmed: toNumber(stats.confirmed),
      canceled: toNumber(stats.canceled),
      expired: toNumber(stats.expired),
      unpaid: toNumber(stats.unpaid),
      paid: toNumber(stats.paid),
      partial: toNumber(stats.partial),
    },
    revenue,
    recentBookings,
  };
}

export async function fetchAdminBookings(
  token: string,
  options: {
    status?: BookingStatus;
    paymentStatus?: PaymentStatus;
    search?: string;
    limit?: number;
    offset?: number;
  } = {},
): Promise<AdminBookingListResponse> {
  const url = new URL(`${baseUrl}/api/admin/bookings`);
  if (options.status) url.searchParams.set('status', options.status);
  if (options.paymentStatus) url.searchParams.set('payment_status', options.paymentStatus);
  if (options.search) url.searchParams.set('search', options.search);
  url.searchParams.set('limit', String(options.limit ?? 50));
  url.searchParams.set('offset', String(options.offset ?? 0));

  const response = await fetch(url.toString(), {
    headers: authHeaders(token),
  });
  const payload = await handleResponse<JsonRecord>(response);
  const items = Array.isArray(payload.items)
    ? payload.items.map((item) => normaliseBookingListItem(item as JsonRecord))
    : [];

  return {
    items,
    total: toNumber(payload.total),
    limit: toNumber(payload.limit),
    offset: toNumber(payload.offset),
  };
}

export async function fetchAdminBooking(
  token: string,
  bookingId: string,
): Promise<AdminBookingDetailData> {
  const response = await fetch(`${baseUrl}/api/admin/bookings/${bookingId}`, {
    headers: authHeaders(token),
  });
  const payload = await handleResponse<JsonRecord>(response);
  return normaliseBookingDetail(payload);
}

export async function updateAdminBooking(
  token: string,
  bookingId: string,
  updates: AdminBookingUpdatePayload,
): Promise<AdminBookingDetailData> {
  const body: JsonRecord = {};
  if (updates.status) body.status = updates.status;
  if (updates.paymentStatus) body.payment_status = updates.paymentStatus;
  if (Object.prototype.hasOwnProperty.call(updates, 'note')) {
    body.note = updates.note ?? null;
  }

  const response = await fetch(`${baseUrl}/api/admin/bookings/${bookingId}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  const payload = await handleResponse<JsonRecord>(response);
  return normaliseBookingDetail(payload);
}

export async function fetchAdminDistancePriceTiers(
  token: string,
): Promise<AdminDistancePriceTierListResponse> {
  const response = await fetch(`${baseUrl}/api/admin/pricing/distance-tiers`, {
    headers: authHeaders(token),
  });
  const payload = await handleResponse<JsonRecord>(response);
  const items = Array.isArray(payload.items)
    ? payload.items.map((item) => normaliseDistancePriceTier(item as JsonRecord))
    : [];

  return { items };
}

export async function createAdminDistancePriceTier(
  token: string,
  payload: AdminDistancePriceTierUpsertPayload,
): Promise<AdminDistancePriceTier> {
  const response = await fetch(`${baseUrl}/api/admin/pricing/distance-tiers`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({
      min_km: payload.minKm,
      max_km: payload.maxKm,
      price: payload.price,
      currency: payload.currency,
      is_active: payload.isActive,
    }),
  });
  const data = await handleResponse<JsonRecord>(response);
  return normaliseDistancePriceTier(data);
}

export async function updateAdminDistancePriceTier(
  token: string,
  tierId: number,
  payload: Partial<AdminDistancePriceTierUpsertPayload>,
): Promise<AdminDistancePriceTier> {
  const body: JsonRecord = {};
  if (Object.prototype.hasOwnProperty.call(payload, 'minKm')) body.min_km = payload.minKm;
  if (Object.prototype.hasOwnProperty.call(payload, 'maxKm')) body.max_km = payload.maxKm;
  if (Object.prototype.hasOwnProperty.call(payload, 'price')) body.price = payload.price;
  if (Object.prototype.hasOwnProperty.call(payload, 'currency')) body.currency = payload.currency;
  if (Object.prototype.hasOwnProperty.call(payload, 'isActive')) body.is_active = payload.isActive;

  const response = await fetch(`${baseUrl}/api/admin/pricing/distance-tiers/${tierId}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  const data = await handleResponse<JsonRecord>(response);
  return normaliseDistancePriceTier(data);
}

export function resolveAdminAssetUrl(path: string): string {
  if (!path) {
    return baseUrl;
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return new URL(path, baseUrl).toString();
}
