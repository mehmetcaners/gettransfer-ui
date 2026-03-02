import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Instagram, Menu, X, type LucideProps, ChevronDown, Globe } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentType, type MouseEvent as ReactMouseEvent } from 'react';
import logoImage from '../images/image.png';
import { useLanguage, type NavKey, type LanguageOption } from '../context/LanguageContext';
import WhatsAppIcon from './icons/WhatsAppIcon';

type ReservationNavTab = 'transfer' | 'tours';

type NavLinkConfig = {
  to: string;
  key: NavKey;
  tab?: ReservationNavTab;
};

const navLinks: NavLinkConfig[] = [
  { to: '/#transfer', key: 'transfer', tab: 'transfer' },
  { to: '/#tours', key: 'tours', tab: 'tours' },
  { to: '/about', key: 'about' },
  { to: '/contact', key: 'contact' },
];

const instagramUrl = import.meta.env.VITE_INSTAGRAM || 'https://instagram.com/gettransferistanbul';
const tripadvisorUrl =
  import.meta.env.VITE_TRIPADVISOR ||
  'https://www.tripadvisor.com.gr/Attraction_Review-g293974-d32963051-Reviews-Gettransfer_istanbul-Istanbul.html';
const whatsappNumber = import.meta.env.VITE_WHATSAPP || '+905551112233';

type SocialLink = {
  key: 'whatsapp' | 'instagram' | 'tripadvisor';
  href: string;
  label: string;
  className: string;
  Icon: ComponentType<{ size?: number | string; className?: string }>;
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const languageDropdownRef = useRef<HTMLDivElement | null>(null);
  const { language, setLanguage, languages, dictionary } = useLanguage();
  const { contact, header } = dictionary;
  const selectedLanguage =
    languages.find((item) => item.code === language) ?? languages[0];

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (option: LanguageOption) => {
    setLanguage(option.code);
    setLanguageMenuOpen(false);
  };

  const socialLinks: SocialLink[] = [
    {
      key: 'whatsapp',
      href: `https://wa.me/${whatsappNumber.replace(/\+/g, '')}`,
      label: contact.whatsappAria,
      className: 'bg-[#25D366]',
      Icon: WhatsAppIcon,
    },
    {
      key: 'instagram',
      href: instagramUrl,
      label: contact.instagramAria,
      className: 'bg-gradient-to-br from-purple-600 to-pink-600',
      Icon: Instagram,
    },
    {
      key: 'tripadvisor',
      href: tripadvisorUrl,
      label: contact.tripadvisorAria,
      className: 'bg-[#00AF87]',
      Icon: TripadvisorIcon,
    },
  ];

  const scrollToReservation = () => {
    if (typeof document === 'undefined') return;
    const target = document.getElementById('reservation');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goToReservation = (tab: ReservationNavTab) => {
    const targetHash = tab === 'tours' ? '#tours' : '#transfer';
    const state = { scrollTarget: 'reservation', reservationTab: tab, scrollId: Date.now() };
    const shouldReplace = location.pathname === '/' && location.hash === targetHash;

    navigate({ pathname: '/', hash: targetHash }, { state, replace: shouldReplace });

    if (location.pathname === '/') {
      scrollToReservation();
    }
    setMobileMenuOpen(false);
  };

  const handleNavClick = (event: ReactMouseEvent<HTMLAnchorElement>, link: NavLinkConfig) => {
    if (link.tab) {
      event.preventDefault();
      goToReservation(link.tab);
      return;
    }

    setMobileMenuOpen(false);
  };

  const handleReservationClick = () => {
    goToReservation('transfer');
  };

  const isLinkActive = (link: NavLinkConfig) => {
    if (link.tab === 'tours') {
      return location.pathname === '/' && location.hash === '#tours';
    }
    if (link.tab === 'transfer') {
      return location.pathname === '/' && location.hash !== '#tours';
    }
    return location.pathname === link.to;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/60 backdrop-blur-2xl transition-all duration-300">
      <nav className="page-shell">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group relative z-10">
            <div className="relative h-16 w-20 rounded-2xl bg-white shadow-md flex items-center justify-center overflow-hidden border border-slate-200/50">
              <img
                src={logoImage}
                alt="GetTransfer İstanbul Logo"
                className="h-[125%] w-[125%] object-contain mix-blend-multiply"
              />
            </div>
            <div className="leading-tight">
              <div className="font-heading text-xl font-bold text-slate-900 tracking-tight">
                GetTransfer
              </div>
              <div className="text-[11px] font-semibold tracking-[0.24em] uppercase text-slate-400">
                İstanbul · Türkiye
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center p-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/60 shadow-lg shadow-slate-200/40 ring-1 ring-white/50">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={(event) => handleNavClick(event, link)}
                  className={`relative px-5 py-2.5 text-sm font-bold rounded-full transition-all duration-300 ${isLinkActive(link)
                    ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/30 scale-105'
                    : 'text-slate-500 hover:text-brand-600 hover:bg-brand-50/50'
                    }`}
                >
                  {header.nav[link.key]}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200/50">
              {socialLinks.map(({ key, href, label, className, Icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-900/5 ring-1 ring-white/50 transition-all hover:-translate-y-1 hover:scale-110 active:scale-95 ${className}`}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReservationClick}
                className="group relative px-6 py-2.5 rounded-full bg-slate-900 text-white font-semibold overflow-hidden shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-brand-500/20 transition-all active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  {header.nav.reservation}
                </span>
              </button>

              <div className="relative" ref={languageDropdownRef}>
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/50 hover:bg-white border border-white/60 hover:border-brand-200 transition-all shadow-sm hover:shadow-md active:scale-95 group"
                  onClick={() => setLanguageMenuOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={languageMenuOpen}
                >
                  <img
                    src={selectedLanguage.flag}
                    alt={`${selectedLanguage.name} flag`}
                    className="h-5 w-5 rounded-full object-cover shadow-sm ring-1 ring-white/50"
                    loading="lazy"
                  />
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-brand-700">
                    {selectedLanguage.code.toUpperCase()}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 group-hover:text-brand-500 transition-transform duration-300 ${languageMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {languageMenuOpen && (
                  <div className="absolute right-0 mt-4 w-48 rounded-2xl bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60 p-1.5 animate-scale-in">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageSelect(language)}
                        className={`flex items-center w-full px-3 py-2.5 space-x-3 text-left text-sm rounded-xl transition-all ${selectedLanguage.code === language.code
                          ? 'bg-brand-50 text-brand-700 font-medium'
                          : 'text-slate-600 hover:bg-slate-50'
                          }`}
                      >
                        <img
                          src={language.flag}
                          alt={`${language.name} flag`}
                          className="h-5 w-5 rounded-full object-cover shadow-sm"
                          loading="lazy"
                        />
                        <span className="flex-1">{language.label}</span>
                        {selectedLanguage.code === language.code && (
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            className="md:hidden rounded-2xl border border-white/60 bg-white/70 p-2 shadow-inner shadow-slate-900/5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 mb-6 rounded-3xl border border-white/70 bg-white/90 backdrop-blur-xl shadow-card p-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={(event) => handleNavClick(event, link)}
                className={`block py-2 text-sm font-semibold transition-colors ${isLinkActive(link) ? 'text-brand-600' : 'text-slate-700 hover:text-brand-600'
                  }`}
              >
                {header.nav[link.key]}
              </Link>
            ))}
            <div className="flex items-center space-x-3 mt-4">
              {socialLinks.map(({ key, href, label, className, Icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-transform hover:scale-105 ${className}`}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
            <button
              onClick={handleReservationClick}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold shadow-glow active:scale-95 transition-all"
            >
              {header.nav.reservation}
            </button>
            <div className="mt-4">
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                {header.languageMenuTitle}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language)}
                    className={`flex items-center justify-start space-x-2 rounded-xl border px-3 py-2 text-sm transition-colors ${selectedLanguage.code === language.code
                      ? 'border-brand-200 text-brand-600 bg-brand-50/70'
                      : 'border-slate-200 text-slate-700 hover:border-brand-200'
                      }`}
                  >
                    <img
                      src={language.flag}
                      alt={`${language.name} flag`}
                      className="h-5 w-5 rounded-full object-cover shadow-sm"
                      loading="lazy"
                    />
                    <span className="font-semibold">{language.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

function TripadvisorIcon({ size = 20, ...props }: LucideProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 9c2-1 4-2 10-2s8 1 10 2" />
      <path d="M5 9 8 6" />
      <path d="M19 9 16 6" />
      <circle cx="8" cy="13" r="3.2" />
      <circle cx="16" cy="13" r="3.2" />
      <circle cx="8" cy="13" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="13" r="1.2" fill="currentColor" stroke="none" />
      <path d="M10.5 11.5 L12 14 L13.5 11.5" />
      <path d="M6 17c2 1.2 10 1.2 12 0" />
    </svg>
  );
}
