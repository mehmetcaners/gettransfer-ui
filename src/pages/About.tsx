import { Users, Award, Clock, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import professionalTransferImg from '../assets/professional-transfer.png';

const statIcons = [Users, Award, Clock, Shield] as const;

export default function About() {
  const { dictionary } = useLanguage();
  const { about } = dictionary;

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-hero-radial opacity-70" aria-hidden />
        <div className="page-shell relative text-center space-y-4">
          <p className="accent-pill mx-auto text-slate-600">{about.missionTitle}</p>
          <h1 className="text-4xl md:text-5xl font-heading font-semibold text-slate-900">
            {about.title}
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            {about.description}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="page-shell">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {about.stats.map((stat, index) => {
              const Icon = statIcons[index] ?? Users;
              return (
                <div
                  key={index}
                  className="rounded-3xl border border-white/70 bg-white/80 p-6 text-center shadow-card"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
                    <Icon size={26} />
                  </div>
                  <div className="text-3xl font-heading text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-600 mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative">
              <div className="absolute -top-10 -left-6 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" aria-hidden />
              <img
                src={professionalTransferImg}
                alt={about.title}
                className="relative rounded-[36px] border border-white/70 shadow-[0_45px_90px_rgba(15,23,42,0.2)] object-cover"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-heading font-semibold text-slate-900">
                {about.missionTitle}
              </h2>
              {about.missionParagraphs.map((paragraph, idx) => (
                <p key={idx} className="text-slate-600 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-[36px] border border-white/70 bg-white/80 backdrop-blur-2xl shadow-card p-8 md:p-12">
            <h2 className="section-title text-center mb-8">{about.whyTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {about.whyItems.map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-white/60 bg-white/60 p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="page-shell text-center">
          <div className="rounded-[40px] bg-gradient-to-br from-brand-700 to-brand-500 text-white px-6 py-12 md:px-12 md:py-16 shadow-[0_35px_80px_rgba(166,114,66,0.35)]">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
              {about.ctaTitle}
            </h2>
            <p className="text-lg opacity-90 mb-8">{about.ctaDescription}</p>
            <a
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white text-brand-600 font-semibold shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 transition-transform"
            >
              {about.ctaButton}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
