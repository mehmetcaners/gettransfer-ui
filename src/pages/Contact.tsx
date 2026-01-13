import { Phone, Mail, MapPin, Clock, Instagram } from 'lucide-react';
import MapEmbed from '../components/MapEmbed';
import { useLanguage } from '../context/LanguageContext';
import WhatsAppIcon from '../components/icons/WhatsAppIcon';

export default function Contact() {
  const whatsapp = import.meta.env.VITE_WHATSAPP || '+905551112233';
  const companyAddress = import.meta.env.VITE_COMPANY_ADDRESS || 'İstanbul, Türkiye';
  const instagramUrl = import.meta.env.VITE_INSTAGRAM || 'https://instagram.com/gettransferistanbul';
  const { dictionary } = useLanguage();
  const { contact } = dictionary;

  const infoCards = [
    {
      icon: Phone,
      title: contact.phoneTitle,
      value: whatsapp,
      href: `tel:${whatsapp}`,
    },
    {
      icon: Mail,
      title: contact.emailTitle,
      value: 'info@gettransfer-istanbul.com',
      href: 'mailto:info@gettransfer-istanbul.com',
    },
    {
      icon: MapPin,
      title: contact.addressTitle,
      value: companyAddress,
    },
    {
      icon: Clock,
      title: contact.hoursTitle,
      value: contact.hoursDescription,
    },
  ];

  const inputClasses =
    'w-full rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-slate-900 placeholder:text-slate-500 shadow-inner shadow-slate-900/5 focus:border-brand-200 focus:ring-4 focus:ring-brand-500/15 outline-none transition';

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 bg-hero-radial opacity-70" aria-hidden />
        <div className="page-shell relative text-center space-y-4">
          <p className="accent-pill mx-auto text-slate-600">{contact.socialTitle}</p>
          <h1 className="text-4xl md:text-5xl font-heading font-semibold text-slate-900">
            {contact.title}
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            {contact.description}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="page-shell">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <div className="space-y-8">
              <h2 className="text-2xl font-heading font-semibold text-slate-900">
                {contact.contactInfoTitle}
              </h2>

              <div className="space-y-4">
                {infoCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.title}
                      className="flex items-start gap-4 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-card"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
                        <Icon size={22} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{card.title}</h3>
                        {card.href ? (
                          <a href={card.href} className="text-slate-600 hover:text-brand-600 transition-colors break-all">
                            {card.value}
                          </a>
                        ) : (
                          <p className="text-slate-600">{card.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-inner shadow-slate-900/5">
                <h3 className="font-semibold text-slate-900 mb-4">{contact.socialTitle}</h3>
                <div className="flex gap-4">
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\+/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-400/30 hover:-translate-y-0.5 transition-transform"
                    aria-label={contact.whatsappAria}
                  >
                    <WhatsAppIcon size={24} />
                  </a>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 hover:-translate-y-0.5 transition-transform"
                    aria-label={contact.instagramAria}
                  >
                    <Instagram size={24} />
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/70 bg-white/80 backdrop-blur-2xl shadow-card p-8">
              <h2 className="text-2xl font-heading font-semibold text-slate-900 mb-6">
                {contact.formTitle}
              </h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-700 mb-2">
                    {contact.form.nameLabel}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    className={inputClasses}
                    placeholder={contact.form.namePlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm font-semibold text-slate-700 mb-2">
                    {contact.form.emailLabel}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    className={inputClasses}
                    placeholder={contact.form.emailPlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-semibold text-slate-700 mb-2">
                    {contact.form.messageLabel}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={6}
                    className={`${inputClasses} resize-none`}
                    placeholder={contact.form.messagePlaceholder}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold shadow-glow hover:-translate-y-0.5 active:scale-95 transition-all"
                >
                  {contact.form.submit}
                </button>
              </form>
            </div>
          </div>

          <MapEmbed />
        </div>
      </section>
    </div>
  );
}
