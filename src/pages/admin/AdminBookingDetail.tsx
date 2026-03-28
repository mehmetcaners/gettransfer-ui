import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, FileDown, Save } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  fetchAdminBooking,
  resolveAdminAssetUrl,
  updateAdminBooking,
  type AdminBookingDetailData,
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

const bookingStatusOptions: BookingStatus[] = ['PENDING', 'CONFIRMED', 'CANCELED', 'EXPIRED'];
const paymentStatusOptions: PaymentStatus[] = ['UNPAID', 'PAID', 'PARTIAL'];

type BookingFormState = {
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  note: string;
};

function toFormState(booking: AdminBookingDetailData): BookingFormState {
  return {
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    note: booking.note ?? '',
  };
}

export default function AdminBookingDetailPage() {
  const { bookingId } = useParams();
  const { token } = useAdminAuth();
  const [booking, setBooking] = useState<AdminBookingDetailData | null>(null);
  const [form, setForm] = useState<BookingFormState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBooking() {
      if (!token || !bookingId) return;

      try {
        setIsLoading(true);
        setError(null);
        const nextBooking = await fetchAdminBooking(token, bookingId);
        if (cancelled) return;
        setBooking(nextBooking);
        setForm(toFormState(nextBooking));
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Rezervasyon yuklenemedi.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadBooking();
    return () => {
      cancelled = true;
    };
  }, [token, bookingId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !bookingId || !form) return;

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);
      const updated = await updateAdminBooking(token, bookingId, {
        status: form.status,
        paymentStatus: form.paymentStatus,
        note: form.note,
      });
      setBooking(updated);
      setForm(toFormState(updated));
      setSuccessMessage('Rezervasyon basariyla guncellendi.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Guncelleme yapilamadi.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-[32px] border border-white/10 bg-white/5 px-6 py-12 text-center text-sm text-slate-300">
        Rezervasyon detaylari yukleniyor...
      </div>
    );
  }

  if (!booking || !form) {
    return (
      <div className="rounded-[32px] border border-rose-400/20 bg-rose-400/10 px-6 py-12 text-center text-sm text-rose-100">
        {error ?? 'Rezervasyon bulunamadi.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-2 text-sm text-cyan-200 transition-colors hover:text-cyan-100"
          >
            <ArrowLeft size={16} />
            Listeye don
          </Link>
          <h1 className="mt-4 text-3xl sm:text-4xl font-heading font-semibold text-white">
            {booking.pnrCode}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
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

        <a
          href={resolveAdminAssetUrl(booking.voucherPdfUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition-colors hover:bg-white/10"
        >
          <FileDown size={16} />
          Voucher indir
        </a>
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 px-5 py-4 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-100">
          {successMessage}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <section className="rounded-[32px] border border-white/10 bg-slate-950/50 p-6 sm:p-8">
          <h2 className="text-2xl font-heading font-semibold text-white">Rezervasyon ozeti</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Musteri</div>
              <div className="mt-3 text-lg font-semibold text-white">
                {booking.firstName} {booking.lastName}
              </div>
              <div className="mt-2 text-sm text-slate-400">{booking.email}</div>
              <div className="mt-1 text-sm text-slate-400">{booking.phone}</div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Rota</div>
              <div className="mt-3 text-sm text-white">{booking.fromText}</div>
              <div className="mt-2 text-sm text-slate-400">{booking.toText}</div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Transfer</div>
              <div className="mt-3 text-lg font-semibold text-white">{booking.vehicleName}</div>
              <div className="mt-2 text-sm text-slate-400">
                {booking.passengers} yolcu · {booking.seats} koltuk · {booking.bags} bagaj
              </div>
              <div className="mt-2 text-sm text-slate-400">
                {booking.roundTrip ? 'Round trip' : 'Tek yon'} · {formatAdminDateTime(booking.pickupDatetime)}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Odeme</div>
              <div className="mt-3 text-lg font-semibold text-white">
                {formatAdminMoney(booking.totalPrice, booking.currency)}
              </div>
              <div className="mt-2 text-sm text-slate-400">
                Tek yon: {formatAdminMoney(booking.basePriceOneWay, booking.currency)}
              </div>
              <div className="mt-1 text-sm text-slate-400">
                Ekstralar: {formatAdminMoney(booking.extrasTotal, booking.currency)}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Zaman damgalari</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="text-sm text-slate-300">
                <span className="text-slate-500">Olusturuldu:</span> {formatAdminDateTime(booking.createdAt)}
              </div>
              <div className="text-sm text-slate-300">
                <span className="text-slate-500">Onaylandi:</span> {formatAdminDateTime(booking.confirmedAt)}
              </div>
              <div className="text-sm text-slate-300">
                <span className="text-slate-500">Iptal:</span> {formatAdminDateTime(booking.canceledAt)}
              </div>
              <div className="text-sm text-slate-300">
                <span className="text-slate-500">Confirm token son:</span>{' '}
                {formatAdminDateTime(booking.confirmExpiresAt)}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Ekstralar</div>
            <div className="mt-4 grid gap-3">
              {booking.extras.length > 0 ? (
                booking.extras.map((extra) => (
                  <div
                    key={extra.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3"
                  >
                    <div>
                      <div className="text-sm font-medium text-white">{extra.title}</div>
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        {extra.code}
                      </div>
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
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl">
          <h2 className="text-2xl font-heading font-semibold text-white">Hizli guncelleme</h2>
          <p className="mt-2 text-sm text-slate-400">
            Operasyon notunu, rezervasyon durumunu ve odeme akisini bu panelden degistirin.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Rezervasyon durumu</span>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((current) =>
                    current ? { ...current, status: event.target.value as BookingStatus } : current,
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none"
              >
                {bookingStatusOptions.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {bookingStatusLabel(statusOption)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Odeme durumu</span>
              <select
                value={form.paymentStatus}
                onChange={(event) =>
                  setForm((current) =>
                    current
                      ? { ...current, paymentStatus: event.target.value as PaymentStatus }
                      : current,
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none"
              >
                {paymentStatusOptions.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {paymentStatusLabel(statusOption)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Operasyon notu</span>
              <textarea
                value={form.note}
                onChange={(event) =>
                  setForm((current) => (current ? { ...current, note: event.target.value } : current))
                }
                rows={6}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none resize-y"
                placeholder="Musteri notu, sofor bilgisi veya dahili takip notu..."
              />
            </label>

            <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
              <div className="text-sm font-semibold text-white">Ek alanlar</div>
              <div className="mt-3 space-y-2 text-sm text-slate-400">
                <div>Flight code: {booking.flightCode || '-'}</div>
                <div>Payment method: {booking.paymentMethod || '-'}</div>
                <div>Voucher no: {booking.voucherNo}</div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3.5 text-sm font-semibold text-slate-950 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save size={16} />
              {isSaving ? 'Kaydediliyor...' : 'Degisiklikleri kaydet'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
