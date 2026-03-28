import { AlertTriangle, BadgeCheck, CreditCard, ReceiptText, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  fetchAdminDashboard,
  type AdminDashboardData,
  type AdminRevenuePeriod,
} from '../../lib/adminApi';
import {
  bookingStatusClass,
  bookingStatusLabel,
  formatAdminDateTime,
  formatAdminMoney,
} from '../../lib/adminFormat';

const statCards = [
  { key: 'total', label: 'Toplam Rezervasyon', Icon: ReceiptText },
  { key: 'pending', label: 'Bekleyen', Icon: AlertTriangle },
  { key: 'confirmed', label: 'Onaylanan', Icon: BadgeCheck },
  { key: 'unpaid', label: 'Odenmemis', Icon: CreditCard },
  { key: 'paid', label: 'Odendi', Icon: Wallet },
] as const;

const revenuePeriods: AdminRevenuePeriod[] = ['day', 'week', 'month'];

export default function AdminDashboardPage() {
  const { token } = useAdminAuth();
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [selectedRevenuePeriod, setSelectedRevenuePeriod] = useState<AdminRevenuePeriod>('day');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      if (!token) return;

      try {
        setIsLoading(true);
        setError(null);
        const nextDashboard = await fetchAdminDashboard(token);
        if (!cancelled) {
          setDashboard(nextDashboard);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Panel verisi alinamadi.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboard();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const selectedRevenue =
    dashboard?.revenue.find((window) => window.period === selectedRevenuePeriod) ?? dashboard?.revenue[0] ?? null;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">Genel Bakis</div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-heading font-semibold text-white">
              Bugun panelinizde neler var
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Son rezervasyonlar, kritik durumlar ve odeme akisi tek ekranda. Burasi ilk operasyon
              kontrol noktaniz olarak calisir.
            </p>
          </div>

          <Link
            to="/admin/bookings"
            className="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-all hover:-translate-y-0.5"
          >
            Tum rezervasyonlari ac
          </Link>
        </div>
      </section>

      {error ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 px-5 py-4 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {statCards.map(({ key, label, Icon }) => (
          <div
            key={key}
            className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 shadow-[0_24px_50px_rgba(2,6,23,0.28)]"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400">{label}</div>
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-200">
                <Icon size={18} />
              </div>
            </div>
            <div className="mt-5 text-4xl font-heading font-semibold text-white">
              {isLoading ? '...' : dashboard?.stats[key] ?? 0}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/50 p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-heading font-semibold text-white">Onaylanan gelir</h2>
            <p className="mt-2 text-sm text-slate-400">
              Onaylanma tarihine gore gunluk, haftalik ve aylik toplam ciro.
            </p>
          </div>

          <div className="inline-flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5">
            {revenuePeriods.map((period) => {
              const window = dashboard?.revenue.find((item) => item.period === period);
              return (
                <button
                  key={period}
                  type="button"
                  onClick={() => setSelectedRevenuePeriod(period)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                    selectedRevenuePeriod === period
                      ? 'bg-cyan-400 text-slate-950'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {window?.label ?? period}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[0.9fr,1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
              {selectedRevenue?.label ?? 'Donem'}
            </div>
            <div className="mt-4 text-4xl font-heading font-semibold text-white">
              {isLoading ? '...' : selectedRevenue?.confirmedBookings ?? 0}
            </div>
            <div className="mt-2 text-sm text-slate-400">Onaylanan rezervasyon sayisi</div>
            <div className="mt-6 space-y-2 text-sm text-slate-400">
              <div>Baslangic: {formatAdminDateTime(selectedRevenue?.startAt)}</div>
              <div>Bitis: {formatAdminDateTime(selectedRevenue?.endAt)}</div>
              <div>Saat dilimi: {selectedRevenue?.timezone ?? 'Europe/Istanbul'}</div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Toplam gelir</div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {isLoading ? (
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-6 text-sm text-slate-300">
                  Gelir verisi yukleniyor...
                </div>
              ) : (selectedRevenue?.totals.length ?? 0) > 0 ? (
                selectedRevenue?.totals.map((total) => (
                  <div
                    key={total.currency}
                    className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 px-4 py-5"
                  >
                    <div className="text-xs uppercase tracking-[0.18em] text-emerald-200/70">
                      {total.currency}
                    </div>
                    <div className="mt-3 text-2xl font-semibold text-white">
                      {formatAdminMoney(total.amount, total.currency)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-slate-400 sm:col-span-2">
                  Bu donemde onaylanan rezervasyon geliri bulunmuyor.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/50 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-heading font-semibold text-white">Son rezervasyonlar</h2>
            <p className="mt-2 text-sm text-slate-400">
              En yeni olusturulan kayitlari buradan hizlica kontrol edebilirsiniz.
            </p>
          </div>
          <div className="text-sm text-slate-400">
            Bekleyen: <span className="text-amber-200">{dashboard?.stats.pending ?? 0}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {(dashboard?.recentBookings ?? []).map((booking) => (
            <Link
              key={booking.id}
              to={`/admin/bookings/${booking.id}`}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 transition-all hover:border-cyan-300/30 hover:bg-white/10"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-lg font-semibold text-white">{booking.pnrCode}</span>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${bookingStatusClass(booking.status)}`}
                    >
                      {bookingStatusLabel(booking.status)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-slate-300">
                    {booking.firstName} {booking.lastName} · {booking.vehicleName}
                  </div>
                  <div className="mt-2 text-sm text-slate-500">
                    {formatAdminDateTime(booking.pickupDatetime)} · {booking.email}
                  </div>
                </div>

                <div className="text-left lg:text-right">
                  <div className="text-sm text-slate-400">Tutar</div>
                  <div className="mt-1 text-xl font-semibold text-white">
                    {formatAdminMoney(booking.totalPrice, booking.currency)}
                  </div>
                  <div className="mt-2 text-sm text-slate-500">
                    Kayit: {formatAdminDateTime(booking.createdAt)}
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {!isLoading && (dashboard?.recentBookings.length ?? 0) === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 px-5 py-10 text-center text-sm text-slate-400">
              Henuz rezervasyon bulunmuyor.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
