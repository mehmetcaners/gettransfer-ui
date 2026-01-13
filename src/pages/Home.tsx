import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReservationBar, { type ReservationTab } from '../components/ReservationBar';
import Accordion from '../components/Accordion';
import MapEmbed from '../components/MapEmbed';
import { Plane, Clock, Shield, Car, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import heroImage from '../images/anasayfagetteansfer.jpg';

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

    setReservationTab((current) => (current === nextTab ? current : nextTab));

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
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-hero-radial opacity-70" aria-hidden />
        <div className="page-shell relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-1">
                <span className="h-2 w-2 rounded-full bg-brand-500" />
                <span className="text-xs font-semibold tracking-[0.3em] text-slate-600 uppercase">
                  {dictionary.home.advantagesTitle}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-heading font-semibold text-slate-900 leading-tight">
                {dictionary.home.heroTitle}
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl">
                {dictionary.home.heroDescription}
              </p>
              <div className="flex flex-wrap gap-2">
                {cities.slice(0, 6).map((city) => (
                  <span
                    key={city}
                    className="px-4 py-1.5 rounded-full border border-white/70 bg-white/80 text-sm font-semibold text-slate-700 shadow-sm"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -top-10 -right-6 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" aria-hidden />
              <img
                src={heroImage}
                alt={dictionary.home.heroTitle}
                className="relative rounded-[36px] border border-white/70 shadow-[0_45px_90px_rgba(15,23,42,0.25)] object-cover"
              />
              <div className="absolute left-8 right-8 -bottom-10 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/70 shadow-card p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {dictionary.home.advantages[0]?.title}
                </p>
                <p className="text-sm font-medium text-slate-800">
                  {dictionary.home.advantages[0]?.description}
                </p>
              </div>
            </div>
          </div>

          <div id="reservation" className="scroll-mt-32 mt-16">
            <ReservationBar activeTab={reservationTab} onTabChange={handleReservationTabChange} />
          </div>
        </div>
      </section>

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
          <MapEmbed />
        </div>
      </section>

      <section className="py-20">
        <div className="page-shell">
          <div className="rounded-[40px] bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white px-6 py-12 md:px-12 md:py-16 text-center shadow-[0_35px_80px_rgba(166,114,66,0.35)]">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
              {dictionary.home.ctaTitle}
            </h2>
            <p className="text-lg opacity-90 mb-8">{dictionary.home.ctaDescription}</p>
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
      </section>
    </div>
  );
}
