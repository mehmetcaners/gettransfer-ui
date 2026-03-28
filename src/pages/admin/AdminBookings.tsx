import { FormEvent, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, FileDown, RefreshCw, Search } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  fetchAdminBooking,
  fetchAdminBookings,
  resolveAdminAssetUrl,
  type AdminBookingDetailData,
  type AdminBookingListResponse,
  type BookingStatus,
  type PaymentStatus,
} from '../../lib/adminApi';
import {
  bookingStatusClass,
  bookingStatusLabel,
  formatAdminDateTime,
  formatAdminMoney,
  paymentStatusClass,
  paymentStatusLabel,
} from '../../lib/adminFormat';

const statusOptions: Array<{ value: BookingStatus | ''; label: string }> = [
  { value: '', label: 'Tum durumlar' },
  { value: 'PENDING', label: 'Bekleyen' },
  { value: 'CONFIRMED', label: 'Onaylanan' },
  { value: 'CANCELED', label: 'Iptal' },
  { value: 'EXPIRED', label: 'Suresi dolan' },
];

const paymentOptions: Array<{ value: PaymentStatus | ''; label: string }> = [
  { value: '', label: 'Tum odemeler' },
  { value: 'UNPAID', label: 'Odenmedi' },
  { value: 'PAID', label: 'Odendi' },
  { value: 'PARTIAL', label: 'Kismi' },
];

const emptyBookings: AdminBookingListResponse = {
  items: [],
  total: 0,
  limit: 50,
  offset: 0,
};

function ExpandedBookingDetails({ booking }: { booking: AdminBookingDetailData }) {
  return (
    <div className="mt-5 grid gap-4 xl:grid-cols-2">
      <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Musteri</div>
        <div className="mt-3 text-lg font-semibold text-white">
          {booking.firstName} {booking.lastName}
        </div>
        <div className="mt-2 text-sm text-slate-300">{booking.email}</div>
        <div className="mt-1 text-sm text-slate-300">{booking.phone}</div>
        <div className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">PNR / Voucher</div>
        <div className="mt-2 text-sm text-slate-300">{booking.pnrCode}</div>
        <div className="mt-1 text-sm text-slate-300">Voucher {booking.voucherNo}</div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Rota</div>
        <div className="mt-3 text-sm text-white">{booking.fromText}</div>
        <div className="mt-2 text-sm text-slate-300">{booking.toText}</div>
        <div className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">Transfer</div>
        <div className="mt-2 text-sm text-slate-300">
          {booking.vehicleName} · {booking.passengers} yolcu · {booking.seats} koltuk · {booking.bags} bagaj
        </div>
        <div className="mt-1 text-sm text-slate-300">
          {booking.roundTrip ? 'Round trip' : 'Tek yon'} · {formatAdminDateTime(booking.pickupDatetime)}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Odeme</div>
        <div className="mt-3 text-lg font-semibold text-white">
          {formatAdminMoney(booking.totalPrice, booking.currency)}
        </div>
        <div className="mt-2 text-sm text-slate-300">
          Tek yon: {formatAdminMoney(booking.basePriceOneWay, booking.currency)}
        </div>
        <div className="mt-1 text-sm text-slate-300">
          Toplam baz fiyat: {formatAdminMoney(booking.basePriceTotal, booking.currency)}
        </div>
        <div className="mt-1 text-sm text-slate-300">
          Ekstralar: {formatAdminMoney(booking.extrasTotal, booking.currency)}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${bookingStatusClass(booking.status)}`}
          >
            {bookingStatusLabel(booking.status)}
          </span>
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${paymentStatusClass(booking.paymentStatus)}`}
          >
            {paymentStatusLabel(booking.paymentStatus)}
          </span>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Zaman damgalari</div>
        <div className="mt-3 space-y-2 text-sm text-slate-300">
          <div>Olusturuldu: {formatAdminDateTime(booking.createdAt)}</div>
          <div>Pickup: {formatAdminDateTime(booking.pickupDatetime)}</div>
          <div>Onaylandi: {formatAdminDateTime(booking.confirmedAt)}</div>
          <div>Iptal: {formatAdminDateTime(booking.canceledAt)}</div>
          <div>Confirm token son: {formatAdminDateTime(booking.confirmExpiresAt)}</div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 xl:col-span-2">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Ekstralar ve notlar</div>
            <div className="mt-3 text-sm text-slate-300">
              {booking.note?.trim() ? booking.note : 'Operasyon notu bulunmuyor.'}
            </div>
          </div>
          <a
            href={resolveAdminAssetUrl(booking.voucherPdfUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition-colors hover:bg-white/10"
          >
            <FileDown size={16} />
            Voucher indir
          </a>
        </div>

        <div className="mt-5 grid gap-3">
          {booking.extras.length > 0 ? (
            booking.extras.map((extra) => (
              <div
                key={extra.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div>
                  <div className="text-sm font-medium text-white">{extra.title}</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{extra.code}</div>
                </div>
                <div className="text-sm font-semibold text-white">
                  {formatAdminMoney(extra.price, extra.currency)}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-slate-400">
              Ekstra secimi bulunmuyor.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminBookingsPage() {
  const { token } = useAdminAuth();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | ''>('');
  const [reloadTick, setReloadTick] = useState(0);
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<Record<string, AdminBookingDetailData>>({});
  const [detailLoadingId, setDetailLoadingId] = useState<string | null>(null);
  const [detailErrors, setDetailErrors] = useState<Record<string, string>>({});
  const [bookings, setBookings] = useState<AdminBookingListResponse>(emptyBookings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBookings() {
      if (!token) return;

      try {
        setIsLoading(true);
        setError(null);
        const nextBookings = await fetchAdminBookings(token, {
          status: statusFilter || undefined,
          paymentStatus: paymentFilter || undefined,
          search: searchQuery || undefined,
          limit: 50,
        });
        if (!cancelled) {
          setBookings(nextBookings);
          setExpandedBookingId((current) =>
            nextBookings.items.some((item) => item.id === current) ? current : null,
          );
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Rezervasyonlar alinamadi.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadBookings();
    return () => {
      cancelled = true;
    };
  }, [token, statusFilter, paymentFilter, searchQuery, reloadTick]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const handleReset = () => {
    setSearchInput('');
    setSearchQuery('');
    setStatusFilter('');
    setPaymentFilter('');
  };

  const handleCardToggle = async (bookingId: string) => {
    if (expandedBookingId === bookingId) {
      setExpandedBookingId(null);
      return;
    }

    setExpandedBookingId(bookingId);
    if (bookingDetails[bookingId] || !token) {
      return;
    }

    try {
      setDetailLoadingId(bookingId);
      setDetailErrors((current) => {
        const next = { ...current };
        delete next[bookingId];
        return next;
      });
      const detail = await fetchAdminBooking(token, bookingId);
      setBookingDetails((current) => ({ ...current, [bookingId]: detail }));
    } catch (detailError) {
      setDetailErrors((current) => ({
        ...current,
        [bookingId]:
          detailError instanceof Error ? detailError.message : 'Rezervasyon detaylari alinamadi.',
      }));
    } finally {
      setDetailLoadingId((current) => (current === bookingId ? null : current));
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">Rezervasyonlar</div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-heading font-semibold text-white">
              Kayitlari filtreleyin ve yonetin
            </h1>
            <p className="mt-3 max-w-3xl text-slate-300">
              PNR, e-posta, telefon veya musteri adi ile arama yapabilirsiniz. Durum ve odeme
              filtresi ile listeyi daraltin.
            </p>
          </div>

          <button
            onClick={() => setReloadTick((value) => value + 1)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
          >
            <RefreshCw size={16} />
            Yenile
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-[1.4fr,0.8fr,0.8fr,auto,auto]">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Ara</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
              <Search size={16} className="text-slate-500" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-slate-500"
                placeholder="PNR, e-posta, telefon"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Rezervasyon durumu</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as BookingStatus | '')}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 outline-none"
            >
              {statusOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Odeme durumu</span>
            <select
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value as PaymentStatus | '')}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 outline-none"
            >
              {paymentOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-all hover:-translate-y-0.5"
          >
            Filtrele
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10"
          >
            Temizle
          </button>
        </form>
      </section>

      {error ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 px-5 py-4 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <section className="rounded-[32px] border border-white/10 bg-slate-950/50 p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-heading font-semibold text-white">Liste</h2>
            <p className="mt-2 text-sm text-slate-400">
              Toplam {bookings.total} kayit gosteriliyor.
            </p>
          </div>
          <div className="text-sm text-slate-500">{isLoading ? 'Yukleniyor...' : 'Hazir'}</div>
        </div>

        <div className="mt-6 grid gap-4">
          {bookings.items.map((booking) => (
            <div
              key={booking.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 transition-all hover:border-cyan-300/30 hover:bg-white/10"
            >
              <button
                type="button"
                onClick={() => void handleCardToggle(booking.id)}
                className="w-full text-left"
                aria-expanded={expandedBookingId === booking.id}
              >
                <div className="grid gap-4 xl:grid-cols-[1.4fr,1fr,1fr,auto] xl:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-lg font-semibold text-white">{booking.pnrCode}</span>
                      <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Voucher {booking.voucherNo}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-slate-300">
                      {booking.firstName} {booking.lastName} · {booking.email}
                    </div>
                    <div className="mt-2 text-sm text-slate-500">
                      {formatAdminDateTime(booking.pickupDatetime)} · {booking.phone}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${bookingStatusClass(booking.status)}`}
                    >
                      {bookingStatusLabel(booking.status)}
                    </span>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${paymentStatusClass(booking.paymentStatus)}`}
                    >
                      {paymentStatusLabel(booking.paymentStatus)}
                    </span>
                  </div>

                  <div>
                    <div className="text-sm text-slate-400">{booking.vehicleName}</div>
                    <div className="mt-2 text-lg font-semibold text-white">
                      {formatAdminMoney(booking.totalPrice, booking.currency)}
                    </div>
                  </div>

                  <div className="inline-flex items-center justify-end gap-2 text-sm text-cyan-200">
                    <span>{expandedBookingId === booking.id ? 'Detayi gizle' : 'Detayi ac'}</span>
                    {expandedBookingId === booking.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </button>

              {expandedBookingId === booking.id ? (
                <div className="mt-5 border-t border-white/10 pt-5">
                  {detailLoadingId === booking.id ? (
                    <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-6 text-sm text-slate-300">
                      Rezervasyon detaylari yukleniyor...
                    </div>
                  ) : detailErrors[booking.id] ? (
                    <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-6 text-sm text-rose-100">
                      {detailErrors[booking.id]}
                    </div>
                  ) : bookingDetails[booking.id] ? (
                    <ExpandedBookingDetails booking={bookingDetails[booking.id]} />
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}

          {!isLoading && bookings.items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 px-5 py-12 text-center text-sm text-slate-400">
              Filtreye uygun rezervasyon bulunamadi.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
