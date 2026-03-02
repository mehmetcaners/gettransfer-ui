import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { CheckCircle, Home, Search, AlertTriangle, FileDown, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { buildVoucherUrl, confirmBooking } from '../lib/api';

type ConfirmStatus = 'loading' | 'success' | 'error' | 'pending';

export default function Confirm() {
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const { clearBooking, bookingReference, bookingData } = useBooking();
  const { dictionary } = useLanguage();
  const { confirm } = dictionary;

  const bookingId = queryParams.get('booking_id') ?? bookingData?.id ?? null;
  const token = queryParams.get('token') ?? bookingData?.confirmToken ?? null;

  const [status, setStatus] = useState<ConfirmStatus>('pending');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);
  const [finalStatus, setFinalStatus] = useState<string | null>(null);
  const hasAttemptedRef = useRef(false);

  const voucherUrl = useMemo(() => {
    if (bookingData?.voucherUrl) return bookingData.voucherUrl;
    if (bookingId) return buildVoucherUrl(bookingId);
    return null;
  }, [bookingData?.voucherUrl, bookingId]);

  useEffect(() => {
    let cancelled = false;
    if (!bookingId || !token) {
      setStatus('pending');
      return;
    }

    const runConfirm = async () => {
      if (hasAttemptedRef.current) return;
      hasAttemptedRef.current = true;
      setStatus('loading');
      setErrorMessage(null);
      try {
        const result = await confirmBooking(bookingId, token);
        if (cancelled) return;
        setFinalStatus(result.status);
        setConfirmedAt(result.confirmedAt ?? null);
        setStatus('success');
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Onay işlemi sırasında bir hata oluştu.');
      }
    };

    void runConfirm();
    return () => {
      cancelled = true;
    };
  }, [bookingId, token]);

  const handleNewSearch = () => {
    clearBooking();
    navigate('/');
  };

  const handleHome = () => {
    clearBooking();
    navigate('/');
  };

  const headline =
    status === 'error'
      ? 'Onaylanamadı'
      : status === 'success'
        ? 'Rezervasyonunuz Onaylandı'
        : status === 'pending'
          ? 'Rezervasyonunuz Alındı'
          : 'Onaylandı';

  const description =
    status === 'error'
      ? errorMessage ?? 'Onay bağlantısı geçersiz veya süresi dolmuş olabilir.'
      : status === 'success'
        ? 'Rezervasyonunuz başarıyla onaylandı. PDF\'i indirip sürücüye gösterebilirsiniz.'
        : status === 'pending'
          ? 'Rezervasyon talebiniz alındı. Onay linki ile doğrulama yapıldığında tamamlanacaktır.'
          : 'Rezervasyonunuz onaylandı.';

  const referenceToShow = bookingData?.pnrCode ?? bookingReference ?? bookingId;

  return (
    <div className="min-h-screen py-16 px-2 sm:px-4 flex items-center justify-center">
      <div className="page-shell max-w-5xl w-full">
        <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] border border-white/70 bg-white/80 backdrop-blur-2xl shadow-[0_45px_90px_rgba(15,23,42,0.15)] p-5 sm:p-8 md:p-10 text-center">
          <div
            className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full ${status === 'error'
              ? 'bg-red-100 text-red-600'
              : status === 'success'
                ? 'bg-emerald-100 text-emerald-600'
                : status === 'pending'
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-blue-100 text-blue-600'
              }`}
          >
            {status === 'error' && <AlertTriangle size={56} />}
            {status === 'success' && <CheckCircle size={56} />}
            {status === 'pending' && <Clock size={56} />}
            {status === 'loading' && <CheckCircle size={56} />}
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-semibold text-slate-900 mb-4">{headline}</h1>
          <p className="text-lg text-slate-600 mb-8">{description}</p>

          {referenceToShow && (
            <div className="rounded-3xl border border-white/70 bg-white/80 text-slate-900 px-6 py-4 mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                {confirm.referenceLabel ?? 'Rezervasyon Numarası'}
              </p>
              <p className="text-2xl font-heading font-semibold mt-2">{referenceToShow}</p>
              {finalStatus && (
                <p className="text-sm text-emerald-600 mt-1">
                  Durum: {finalStatus}
                  {confirmedAt ? ` • ${new Date(confirmedAt).toLocaleString()}` : ''}
                </p>
              )}
            </div>
          )}

          {voucherUrl && (
            <div className="rounded-3xl border border-brand-500/30 bg-brand-500/5 p-5 mb-6 text-left flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">Rezervasyon PDF</p>
                  <p className="text-sm text-slate-600">
                    Rezervasyon detayları PDF olarak indirilebilir. Sürücüye ibraz edebilirsiniz.
                  </p>
                </div>
                <span className="text-xs font-semibold text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
                  PDF
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-start">
                <a
                  href={voucherUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold shadow-glow hover:-translate-y-0.5 active:scale-95 transition-all"
                >
                  <FileDown size={18} />
                  <span>PDF İndir</span>
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(voucherUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-green-500 text-green-700 bg-green-50 font-semibold hover:-translate-y-0.5 active:scale-95 transition-all"
                >
                  WhatsApp ile paylaş
                </a>
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-brand-500/30 bg-brand-500/10 p-6 mb-6 text-left">
            <p className="font-semibold text-slate-900 mb-2">{confirm.cashTitle}</p>
            <p className="text-slate-700">{confirm.cashMessage}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 mb-8 text-left">
            <p className="font-semibold text-slate-900 mb-2">{confirm.contactTitle}</p>
            <p className="text-slate-700">{confirm.contactMessage}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleNewSearch}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold shadow-glow hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
              disabled={status === 'loading'}
            >
              <Search size={20} />
              <span>{confirm.newSearch}</span>
            </button>
            <button
              onClick={handleHome}
              className="px-8 py-4 rounded-2xl border border-white/70 bg-white text-slate-700 font-semibold hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Home size={20} />
              <span>{confirm.home}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
