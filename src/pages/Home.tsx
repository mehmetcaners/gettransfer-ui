import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReservationBar from '../components/ReservationBar';
import Accordion from '../components/Accordion';
import MapEmbed from '../components/MapEmbed';
import { Plane, Clock, Shield, Car, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import heroImage from '../images/anasayfagetteansfer.jpg';

type ReservationTab = 'transfer' | 'hourly' | 'tours';

const resolveTabFromHash = (hash: string): ReservationTab | null => {
  if (hash === '#tours') return 'tours';
  if (hash === '#hourly') return 'hourly';
  if (hash === '#transfer' || hash === '#reservation') return 'transfer';
  return null;
};

const hashFromTab = (tab: ReservationTab) => {
  if (tab === 'tours') return '#tours';
  if (tab === 'hourly') return '#hourly';
  return '#transfer';
};

const advantageIcons = {
  plane: Plane,
  clock: Clock,
  shield: Shield,
  car: Car,
} as const;

export default function Home() {
  const { dictionary } = useLanguage();
  const cities = dictionary.home.cities;
  const location = useLocation();
  const navigate = useNavigate();
  const [reservationTab, setReservationTab] = useState<ReservationTab>('transfer');

  const scrollToReservation = useCallback(() => {
    if (typeof document === 'undefined') return;
    const target = document.getElementById('reservation');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    const state = location.state as { scrollTarget?: string; reservationTab?: ReservationTab } | null;
    const tabFromHash = resolveTabFromHash(location.hash);
    const nextTab = state?.reservationTab ?? tabFromHash ?? 'transfer';

    setReservationTab((current: ReservationTab) => (current === nextTab ? current : nextTab));

    if (state?.scrollTarget === 'reservation' || tabFromHash) {
      scrollToReservation();
    }

    if (state?.scrollTarget || state?.reservationTab) {
      navigate(
        { pathname: location.pathname, search: location.search, hash: location.hash },
        { replace: true, state: null },
      );
    }
  }, [location, navigate, scrollToReservation]);

  const handleReservationTabChange = (tab: ReservationTab) => {
    setReservationTab(tab);

    if (location.pathname === '/') {
      const hash = hashFromTab(tab);
      if (location.hash !== hash) {
        navigate({ pathname: location.pathname, search: location.search, hash }, { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative font-sans">
      <section className="relative pt-6 pb-3 md:pt-8 md:pb-4">
        <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8">
          <div className="relative min-h-[35rem] md:min-h-[42rem] overflow-hidden rounded-[32px] md:rounded-[40px] bg-[#f7f4ef] shadow-[0_26px_70px_rgba(15,23,42,0.08)]">
            <div className="absolute inset-0 z-0">
              <img
                src={heroImage}
                alt="Hero Background"
                className="w-full h-full object-cover object-[76%_center] scale-[1.08] brightness-[1.02] contrast-[1.04] sm:object-[80%_center] sm:scale-[1.05] lg:object-[86%_center] lg:scale-[1.01]"
              />
            </div>

            <div className="absolute inset-0 z-0 bg-[linear-gradient(90deg,rgba(250,248,243,0.96)_0%,rgba(250,248,243,0.91)_18%,rgba(250,248,243,0.68)_30%,rgba(250,248,243,0.22)_41%,rgba(250,248,243,0)_55%)]" />
            <div className="absolute inset-y-0 right-0 z-0 w-[14%] bg-[linear-gradient(270deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0)_72%)]" />

            <div className="relative z-10 flex min-h-[35rem] md:min-h-[42rem] w-full flex-col justify-between px-6 py-8 sm:px-8 md:px-10 md:py-10 xl:px-14 xl:py-12">
              <div className="max-w-[34rem] md:max-w-[40rem] xl:max-w-[42rem] animate-fade-in-up">
                <span className="text-[0.7rem] font-bold tracking-[0.16em] text-[#1e293b] uppercase mb-1 block">
                  EKSTRA İNDİRİM.
                </span>

                <h1 className="font-sans text-[1.85rem] sm:text-[2.15rem] md:text-[2.7rem] xl:text-[3.25rem] font-medium text-[#0f172a] leading-[0.98] tracking-[-0.05em]">
                  Güvenli ve rahat<br />yolculuk.
                </h1>

                {/* Circular Arrow Buttons */}
                <div className="flex gap-3 mt-4 md:mt-6">
                  <button
                    className="w-[44px] h-[44px] rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-white transition-colors bg-white/40 backdrop-blur-sm"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={18} strokeWidth={2} />
                  </button>
                  <button
                    className="w-[44px] h-[44px] rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-white transition-colors bg-white/40 backdrop-blur-sm"
                    aria-label="Next"
                  >
                    <ChevronRight size={18} strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div id="reservation" className="scroll-mt-32 relative z-20 mt-6 md:mt-8 w-full">
                <ReservationBar activeTab={reservationTab} onTabChange={handleReservationTabChange} />
              </div>

              <div className="mt-4 text-sm font-semibold text-slate-700 tracking-wide">
                Istanbul Airport Transfer
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-lg hover:-translate-y-1 hover:shadow-xl hover:bg-[#20bd5a] transition-all font-semibold"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 fill-current">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
        WhatsApp
      </a>

      <section className="py-20">
        <div className="page-shell">
          <div className="text-center mb-12">
            <h2 className="section-title">{dictionary.home.advantagesTitle}</h2>
            <p className="section-subtitle mt-3">{dictionary.home.citiesDescription}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dictionary.home.advantages.map((advantage, index) => {
              const Icon = advantageIcons[advantage.icon];
              return (
                <div
                  key={index}
                  className="relative rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl p-6 shadow-card transition-all hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-500/15 text-brand-600 flex items-center justify-center mb-4">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{advantage.title}</h3>
                  <p className="text-slate-600">{advantage.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="page-shell">
          <div className="text-center mb-10">
            <h2 className="section-title">{dictionary.home.citiesTitle}</h2>
            <p className="section-subtitle mt-3">{dictionary.home.citiesDescription}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {cities.map((city) => (
              <div
                key={city}
                className="rounded-3xl border border-white/70 bg-white/80 px-4 py-5 text-center shadow-inner shadow-slate-900/5 hover:-translate-y-0.5 transition-transform"
              >
                <MapPin size={22} className="mx-auto mb-2 text-brand-600" />
                <span className="font-semibold text-slate-900">{city}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20">
        <div className="page-shell max-w-4xl">
          <h2 className="section-title text-center mb-10">{dictionary.home.faqTitle}</h2>
          <Accordion items={dictionary.home.faq} />
        </div>
      </section>

      <section className="py-20">
        <div className="page-shell">
          <div className="grid gap-8 xl:grid-cols-[1.18fr,0.82fr] xl:items-stretch">
            <MapEmbed className="h-full" />

            <div className="rounded-[40px] bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 px-6 py-12 text-center text-white shadow-[0_35px_80px_rgba(166,114,66,0.35)] md:px-10 md:py-14 xl:flex xl:h-full xl:flex-col xl:items-center xl:justify-center">
              <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
                {dictionary.home.ctaTitle}
              </h2>
              <p className="mx-auto max-w-[28rem] text-lg opacity-90 mb-8">
                {dictionary.home.ctaDescription}
              </p>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white text-brand-600 font-semibold shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 transition-transform"
              >
                {dictionary.home.ctaButton}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
