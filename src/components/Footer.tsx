import { Phone, Mail, Instagram } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import WhatsAppIcon from './icons/WhatsAppIcon';

export default function Footer() {
  const companyName = import.meta.env.VITE_COMPANY_NAME || 'GetTransfer İstanbul';
  const whatsapp = import.meta.env.VITE_WHATSAPP || '+905551112233';
  const instagramUrl = import.meta.env.VITE_INSTAGRAM || 'https://instagram.com/gettransferistanbul';
  const { dictionary } = useLanguage();
  const { footer, general, contact } = dictionary;

  return (
    <footer className="relative overflow-hidden bg-slate-900 text-slate-300 pt-20 pb-10">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.15),_transparent_50%)]" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(166,114,66,0.1),_transparent_50%)]" aria-hidden />

      <div className="page-shell relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-brand-300 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                {footer.quickLinksTitle}
              </div>
              <h3 className="text-3xl font-heading font-medium text-white tracking-tight">{companyName}</h3>
            </div>
            <p className="text-base text-slate-400 max-w-lg leading-relaxed">
              {footer.description}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href={`https://wa.me/${whatsapp.replace(/\+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/20 hover:-translate-y-1 transition-transform duration-300"
                aria-label={general.whatsappAria}
              >
                <WhatsAppIcon size={24} />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white shadow-lg shadow-pink-900/20 hover:-translate-y-1 transition-transform duration-300"
                aria-label={contact.instagramAria}
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-semibold text-lg tracking-wide">{footer.contactTitle}</h4>
            <div className="space-y-4">
              <a
                href={`tel:${whatsapp}`}
                className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 px-5 py-4 hover:bg-white/10 hover:border-white/10 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                  <Phone size={18} className="text-brand-400" />
                </div>
                <span className="text-slate-300 group-hover:text-white transition-colors">{whatsapp}</span>
              </a>
              <a
                href="mailto:info@gettransfer-istanbul.com"
                className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 px-5 py-4 hover:bg-white/10 hover:border-white/10 transition-all duration-300 break-all"
              >
                <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                  <Mail size={18} className="text-brand-400" />
                </div>
                <span className="text-slate-300 group-hover:text-white transition-colors">info@gettransfer-istanbul.com</span>
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-semibold text-lg tracking-wide">{footer.quickLinksTitle}</h4>
            <ul className="space-y-3">
              {[
                { href: '/about', label: footer.links.about },
                { href: '/contact', label: footer.links.contact },
                { href: '/#faq', label: footer.links.faq },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-slate-400 hover:text-brand-300 transition-colors py-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row gap-6 items-center justify-between">
          <p className="text-sm text-slate-500">
            {footer.rights(new Date().getFullYear(), companyName)}
          </p>
          <div className="rounded-full border border-brand-500/30 bg-brand-900/20 px-6 py-2 text-xs font-semibold tracking-wide text-brand-300 uppercase">
            {footer.cashWarning}
          </div>
        </div>
      </div>
    </footer>
  );
}
