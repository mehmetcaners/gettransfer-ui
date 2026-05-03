import { Award, Car, Check, Clock, MapPin, Plane, Shield, Users } from 'lucide-react';
import professionalTransferImg from '../assets/professional-transfer.png';
import { useLanguage } from '../context/LanguageContext';

const statIcons = [Award, Car, Users, Plane] as const;
const reasonIcons = [Clock, MapPin, Car, Shield] as const;

export default function About() {
  const { dictionary } = useLanguage();
  const { about } = dictionary;

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0 bg-hero-radial opacity-70" aria-hidden />
        <div className="page-shell relative">
          <div className="mx-auto max-w-4xl text-center">
            <span className="accent-pill mx-auto">{about.badge}</span>
            <h1 className="mt-5 text-4xl font-heading font-semibold tracking-tight text-slate-900 md:text-5xl">
              {about.title}
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
              {about.description}
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {about.stats.map((stat, index) => {
              const Icon = statIcons[index] ?? Users;

              return (
                <div
                  key={stat.label}
                  className="group rounded-[30px] border border-white/80 bg-white/85 p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(15,23,42,0.10)]"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 shadow-inner shadow-brand-500/10">
                    <Icon size={26} />
                  </div>
                  <div className="text-3xl font-heading font-semibold text-slate-900">{stat.value}</div>
                  <div className="mt-1 text-base font-semibold text-slate-800">{stat.label}</div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{stat.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-14 md:pb-20">
        <div className="page-shell">
          <div className="grid items-center gap-8 lg:grid-cols-[1.02fr,0.98fr] xl:gap-12">
            <div className="relative order-1">
              <div className="absolute -left-6 top-6 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" aria-hidden />
              <div className="absolute -right-4 bottom-10 h-40 w-40 rounded-full bg-slate-200/60 blur-3xl" aria-hidden />

              <div className="relative overflow-hidden rounded-[36px] border border-white/80 bg-white shadow-[0_40px_80px_rgba(15,23,42,0.12)]">
                <img
                  src={professionalTransferImg}
                  alt={about.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-x-5 bottom-5 rounded-[24px] border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur-xl">
                  <div className="flex flex-wrap gap-2">
                    {about.imageTags.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="order-2 rounded-[36px] border border-white/80 bg-white/85 p-7 shadow-card md:p-9">
              <div className="mb-6 flex items-center gap-3">
                <span className="accent-pill">{about.missionTitle}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-brand-200 to-transparent" />
              </div>

              <h2 className="text-3xl font-heading font-semibold text-slate-900">{about.missionTitle}</h2>
              {about.missionParagraphs.map((paragraph) => (
                <p key={paragraph} className="mt-5 text-base leading-8 text-slate-600">
                  {paragraph}
                </p>
              ))}

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {about.missionChecklist.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-[22px] border border-brand-100 bg-brand-50/50 px-4 py-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm">
                      <Check size={18} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="page-shell">
          <div className="rounded-[36px] border border-white/80 bg-white/85 p-8 shadow-card md:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <span className="accent-pill mx-auto">{about.whyTitle}</span>
              <h2 className="mt-5 text-3xl font-heading font-semibold text-slate-900 md:text-4xl">
                {about.whyTitle}
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">
                {about.whyDescription}
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {about.whyItems.map((item, index) => {
                const Icon = reasonIcons[index] ?? Shield;

                return (
                  <div
                    key={item.title}
                    className="group rounded-[28px] border border-slate-100 bg-slate-50/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-100 hover:bg-white hover:shadow-[0_24px_50px_rgba(15,23,42,0.08)]"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 shadow-inner shadow-brand-500/10">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="page-shell text-center">
          <div className="rounded-[40px] bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 px-6 py-12 text-white shadow-[0_35px_80px_rgba(166,114,66,0.28)] md:px-12 md:py-16">
            <h2 className="text-3xl font-heading font-semibold md:text-4xl">
              {about.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 opacity-90">
              {about.ctaDescription}
            </p>
            <a
              href="/#reservation"
              className="mt-8 inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 font-semibold text-brand-600 shadow-lg shadow-slate-900/10 transition-transform hover:-translate-y-0.5"
            >
              {about.ctaButton}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
