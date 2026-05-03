import {
  Award,
  Car,
  Check,
  Clock,
  MapPin,
  Plane,
  Shield,
  Users,
  type LucideIcon,
} from 'lucide-react';
import professionalTransferImg from '../assets/professional-transfer.png';

type StatItem = {
  value: string;
  label: string;
  detail: string;
  icon: LucideIcon;
};

type ReasonItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const stats: StatItem[] = [
  {
    value: '20+',
    label: 'Yıllık Tecrübe',
    detail: 'İstanbul Havalimanı ve Sabiha Gökçen transferlerinde güçlü saha deneyimi.',
    icon: Award,
  },
  {
    value: '25.000+',
    label: 'Başarılı Transfer',
    detail: 'Havalimanı, otel ve şehir içi ulaşım operasyonlarında tamamlanan yolculuklar.',
    icon: Car,
  },
  {
    value: '10.000+',
    label: 'Mutlu Misafir',
    detail: 'Yurtdışından gelen misafirler için güven veren ve planlı ulaşım deneyimi.',
    icon: Users,
  },
  {
    value: '7/24',
    label: 'Havalimanı Karşılama',
    detail: 'Uçuş saatine göre planlanan, günün her anında aktif karşılama desteği.',
    icon: Plane,
  },
];

const checklist = [
  'Havalimanında karşılama',
  'Otel ve şehir içi transfer',
  'Türkiye turu ve özel rota desteği',
  'Profesyonel sürücü ve konforlu araç',
];

const reasons: ReasonItem[] = [
  {
    title: '20 Yıllık Havalimanı Deneyimi',
    description:
      'İstanbul Havalimanı ve Sabiha Gökçen transferlerinde yıllardır edindiğimiz saha deneyimiyle misafirlerimizi doğru zamanda, doğru noktadan karşılıyoruz.',
    icon: Clock,
  },
  {
    title: 'Yurtdışı Misafir Karşılama',
    description:
      'İstanbul’a ilk kez gelen misafirler için anlaşılır iletişim, kolay buluşma noktası ve güven veren karşılama süreci sunuyoruz.',
    icon: MapPin,
  },
  {
    title: 'Otel, Transfer ve Tur Hizmetleri',
    description:
      'Havalimanı-otel transferlerinin yanında şehir içi ulaşım, özel rota ve Türkiye turu ihtiyaçlarında da destek sağlıyoruz.',
    icon: Car,
  },
  {
    title: 'Şeffaf ve Güvenilir Hizmet',
    description:
      'Rezervasyon öncesi net bilgilendirme, zamanında hizmet ve sürpriz maliyet oluşturmayan fiyat politikasıyla güvenilir bir yolculuk sunuyoruz.',
    icon: Shield,
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0 bg-hero-radial opacity-70" aria-hidden />
        <div className="page-shell relative">
          <div className="mx-auto max-w-4xl text-center">
            <span className="accent-pill mx-auto">HAKKIMIZDA</span>
            <h1 className="mt-5 text-4xl font-heading font-semibold tracking-tight text-slate-900 md:text-5xl">
              İstanbul Havalimanı Transferinde 20 Yıllık Güven
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
              Yurtdışından gelen misafirlerimizi İstanbul Havalimanı ve Sabiha Gökçen’de karşılıyor,
              otel transferi, şehir içi ulaşım ve Türkiye turu hizmetlerinde konforlu, güvenli ve
              zamanında yolculuk deneyimi sunuyoruz.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="group rounded-[30px] border border-white/80 bg-white/85 p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(15,23,42,0.10)]"
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 shadow-inner shadow-brand-500/10">
                      <Icon size={26} />
                    </div>
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-500">
                      Premium
                    </span>
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
                  alt="GetTransfer Istanbul havalimanı transfer hizmeti"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-x-5 bottom-5 rounded-[24px] border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur-xl">
                  <div className="flex flex-wrap gap-2">
                    {['İstanbul Havalimanı', 'Sabiha Gökçen', 'Otel Transferi', 'Şehir İçi Ulaşım'].map((item) => (
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
                <span className="accent-pill">Misyonumuz</span>
                <div className="h-px flex-1 bg-gradient-to-r from-brand-200 to-transparent" />
              </div>

              <h2 className="text-3xl font-heading font-semibold text-slate-900">Misyonumuz</h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Misyonumuz, İstanbul’a gelen her misafirimize havalimanından itibaren güvenli,
                konforlu ve sorunsuz bir ulaşım deneyimi sunmaktır. 20 yıllık saha tecrübemizle;
                uçuş takibi, zamanında karşılama, profesyonel sürücü desteği ve modern araç
                filomuzla misafirlerimizin yolculuğunu kolaylaştırıyoruz.
              </p>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Sadece transfer değil; otel ulaşımı, şehir içi özel şoförlü hizmetler ve Türkiye
                turu planlarında da misafirlerimize güvenilir bir yol arkadaşı olmayı hedefliyoruz.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {checklist.map((item) => (
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
              <span className="accent-pill mx-auto">Neden Biz?</span>
              <h2 className="mt-5 text-3xl font-heading font-semibold text-slate-900 md:text-4xl">
                Neden Bizi Seçmelisiniz?
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">
                İstanbul’a gelen misafirler için havalimanı karşılamadan otel ulaşımına kadar planlı,
                şeffaf ve güven veren bir transfer operasyonu sunuyoruz.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {reasons.map((item) => {
                const Icon = item.icon;

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
              İstanbul’a İndiğiniz Andan İtibaren Güvenli Ulaşım
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 opacity-90">
              İstanbul Havalimanı, Sabiha Gökçen, otel transferleri, şehir içi ulaşım ve Türkiye
              turu planları için rezervasyonunuzu birkaç adımda oluşturun.
            </p>
            <a
              href="/#reservation"
              className="mt-8 inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 font-semibold text-brand-600 shadow-lg shadow-slate-900/10 transition-transform hover:-translate-y-0.5"
            >
              Transfer Planla
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
