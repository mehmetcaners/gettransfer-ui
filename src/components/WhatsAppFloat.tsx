import { useLanguage } from '../context/LanguageContext';
import WhatsAppIcon from './icons/WhatsAppIcon';

export default function WhatsAppFloat() {
  const whatsapp = import.meta.env.VITE_WHATSAPP || '+905551112233';
  const cleanNumber = whatsapp.replace(/\+/g, '');
  const { dictionary } = useLanguage();

  return (
    <a
      href={`https://wa.me/${cleanNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed inset-auto bottom-5 right-5 z-50 hidden h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-[0_18px_35px_rgba(16,185,129,0.35)] ring-2 ring-white/60 transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60 active:scale-95 sm:flex md:bottom-7 md:right-7"
      aria-label={dictionary.general.whatsappAria}
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-white/30 blur-md opacity-0 group-hover:opacity-40 transition-opacity" aria-hidden />
      <WhatsAppIcon size={18} />
    </a>
  );
}
