import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { CheckCircle, Home, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Confirm() {
  const navigate = useNavigate();
  const { clearBooking, bookingReference } = useBooking();
  const { dictionary } = useLanguage();
  const { confirm } = dictionary;

  const handleNewSearch = () => {
    clearBooking();
    navigate('/');
  };

  const handleHome = () => {
    clearBooking();
    navigate('/');
  };

  return (
    <div className="min-h-screen py-16 px-4 flex items-center justify-center">
      <div className="page-shell max-w-2xl">
        <div className="relative overflow-hidden rounded-[40px] border border-white/70 bg-white/80 backdrop-blur-2xl shadow-[0_45px_90px_rgba(15,23,42,0.15)] p-8 md:p-12 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle size={56} />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-semibold text-slate-900 mb-4">
            {confirm.title}
          </h1>
          <p className="text-lg text-slate-600 mb-8">{confirm.description}</p>

          {bookingReference && (
            <div className="rounded-3xl border border-white/70 bg-white/80 text-slate-900 px-6 py-4 mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                {confirm.referenceLabel ?? 'Rezervasyon Numarası'}
              </p>
              <p className="text-2xl font-heading font-semibold mt-2">{bookingReference}</p>
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
