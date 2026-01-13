import { Phone, Mail, MapPin, Instagram } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import WhatsAppIcon from './icons/WhatsAppIcon';

export default function Footer() {
  const companyName = import.meta.env.VITE_COMPANY_NAME || 'GetTransfer İstanbul';
  const companyAddress = import.meta.env.VITE_COMPANY_ADDRESS || 'İstanbul, Türkiye';
  const whatsapp = import.meta.env.VITE_WHATSAPP || '+905551112233';
  const instagramUrl = import.meta.env.VITE_INSTAGRAM || 'https://instagram.com/gettransferistanbul';
  const { dictionary } = useLanguage();
  const { footer, general, contact } = dictionary;

  return (
    <footer className="relative overflow-hidden bg-[#06070d] text-gray-300">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(246,63,81,0.15),_transparent_45%)]" aria-hidden />
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'120\' height=\'120\' viewBox=\'0 0 120 120\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M60 0L120 60L60 120L0 60Z\' stroke=\'%23ffffff10\'/%3E%3C/g%3E%3C/svg%3E")' }} aria-hidden />
      <div className="page-shell relative py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2 space-y-5">
            <div>
              <p className="accent-pill border-white/20 text-white/70">
                {footer.quickLinksTitle}
              </p>
              <h3 className="mt-4 text-3xl font-heading font-semibold text-white">{companyName}</h3>
            </div>
            <p className="text-sm md:text-base text-white/70 max-w-xl leading-relaxed">
              {footer.description}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${whatsapp.replace(/\+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5 transition-transform"
                aria-label={general.whatsappAria}
              >
                <WhatsAppIcon size={22} />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 hover:-translate-y-0.5 transition-transform"
                aria-label={contact.instagramAria}
              >
                <Instagram size={22} />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold text-lg">{footer.contactTitle}</h4>
            <div className="space-y-4 text-sm">
              <a
                href={`tel:${whatsapp}`}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:border-brand-500/40 transition-colors"
              >
                <Phone size={18} className="text-brand-200" />
                <span>{whatsapp}</span>
              </a>
              <a
                href="mailto:info@gettransfer-istanbul.com"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:border-brand-500/40 transition-colors break-all"
              >
                <Mail size={18} className="text-brand-200" />
                <span>info@gettransfer-istanbul.com</span>
              </a>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <MapPin size={18} className="mt-1 text-brand-200" />
                <span>{companyAddress}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-lg mb-4">{footer.quickLinksTitle}</h4>
            <div className="space-y-2 text-sm text-white/70">
              <a href="/about" className="block rounded-xl px-3 py-2 hover:bg-white/5">
                {footer.links.about}
              </a>
              <a href="/contact" className="block rounded-xl px-3 py-2 hover:bg-white/5">
                {footer.links.contact}
              </a>
              <a href="/#faq" className="block rounded-xl px-3 py-2 hover:bg-white/5">
                {footer.links.faq}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-5 text-sm text-white/70">
            {footer.rights(new Date().getFullYear(), companyName)}
          </div>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-brand-500/20 to-brand-600/20 px-6 py-5 text-sm font-semibold text-brand-100">
            {footer.cashWarning}
          </div>
        </div>
      </div>
    </footer>
  );
}
