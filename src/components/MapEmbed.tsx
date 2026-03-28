import { useLanguage } from '../context/LanguageContext';

type MapEmbedProps = {
  className?: string;
};

const fallbackAddress =
  'Tayakadın, Terminal Caddesi No:1, 34283 Arnavutköy/İstanbul';

const buildEmbedUrl = (address: string) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=15`;

export default function MapEmbed({ className = '' }: MapEmbedProps) {
  const companyAddress =
    import.meta.env.VITE_COMPANY_ADDRESS?.trim() || fallbackAddress;
  const embedUrl =
    import.meta.env.VITE_GOOGLE_MAPS_EMBED?.trim() || buildEmbedUrl(companyAddress);
  const { dictionary } = useLanguage();

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[32px] border border-white/70 bg-white/90 backdrop-blur-2xl shadow-card ${className}`.trim()}
    >
      <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" aria-hidden />
      <div className="relative p-6 border-b border-white/60">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{dictionary.contact.addressTitle}</p>
        <h3 className="text-2xl font-heading font-semibold text-slate-900">{dictionary.contact.mapTitle}</h3>
        <p className="text-slate-600 text-sm mt-2">{companyAddress}</p>
      </div>
      <div className="relative w-full h-96">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={dictionary.contact.mapTitle}
        />
      </div>
    </div>
  );
}
