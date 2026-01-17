import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReservationBar from '../components/ReservationBar';
import Accordion from '../components/Accordion';
import MapEmbed from '../components/MapEmbed';
import { Plane, Clock, Shield, Car, MapPin } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50">
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-24">
        {/* Abstract Background Elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 inset-x-0 h-[800px] bg-gradient-to-b from-brand-50/80 to-transparent" />
          <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] bg-brand-200/30 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-float" />
          <div className="absolute top-[100px] -left-[200px] w-[500px] h-[500px] bg-sky-200/30 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="page-shell relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-brand-200 bg-white/60 backdrop-blur-md px-4 py-1.5 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
                </span>
                <span className="text-xs font-bold tracking-[0.2em] text-brand-700 uppercase">
                  {dictionary.home.advantagesTitle}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl xl:text-7xl font-heading font-medium text-slate-900 leading-[1.1] tracking-tight">
                {dictionary.home.heroTitle}
              </h1>

              <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
                {dictionary.home.heroDescription}
              </p>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {cities.slice(0, 6).map((city) => (
                  <span
                    key={city}
                    className="px-5 py-2 rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-600 shadow-sm hover:border-brand-300 hover:text-brand-600 transition-colors cursor-default"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block animate-scale-in">
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-500 to-indigo-500 rounded-[48px] opacity-20 blur-2xl" />
              <img
                src={heroImage}
                alt={dictionary.home.heroTitle}
                className="relative rounded-[40px] border border-white/50 shadow-2xl shadow-brand-900/10 object-cover aspect-[4/3]"
              />

              {/* Floating Card */}
              <div className="absolute -left-8 -bottom-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-glass p-6 animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600">
                    <Shield size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      {dictionary.home.advantages[0]?.title}
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {dictionary.home.advantages[0]?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="reservation" className="scroll-mt-32 mt-24">
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
