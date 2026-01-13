import { Home, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { dictionary } = useLanguage();
  const { notFound } = dictionary;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="page-shell max-w-2xl">
        <div className="rounded-[40px] border border-white/70 bg-white/80 backdrop-blur-2xl p-10 text-center shadow-[0_40px_80px_rgba(15,23,42,0.15)]">
          <div className="text-7xl md:text-8xl font-heading font-semibold text-brand-600 mb-4">404</div>
          <h1 className="text-3xl font-heading font-semibold text-slate-900 mb-4">
            {notFound.title}
          </h1>
          <p className="text-slate-600 mb-8">{notFound.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold shadow-glow hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Home size={20} />
              <span>{notFound.home}</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 rounded-2xl border border-white/70 bg-white text-slate-700 font-semibold hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Search size={20} />
              <span>{notFound.search}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
