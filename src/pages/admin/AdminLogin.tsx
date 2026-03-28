import { FormEvent, useState } from 'react';
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

function getRedirectPath(locationState: unknown): string {
  if (!locationState || typeof locationState !== 'object') {
    return '/admin/dashboard';
  }

  const from = (locationState as { from?: unknown }).from;
  if (typeof from !== 'string' || !from.startsWith('/admin')) {
    return '/admin/dashboard';
  }

  return from;
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, login, isSubmitting, authError } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const redirectPath = getRedirectPath(location.state);

  if (admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    try {
      await login(username.trim(), password);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Giris yapilamadi.');
    }
  };

  const visibleError = localError ?? authError;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.2),_transparent_30%),linear-gradient(160deg,_#020617_0%,_#0f172a_52%,_#111827_100%)] text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl rounded-[36px] overflow-hidden border border-white/10 bg-slate-950/65 shadow-[0_40px_120px_rgba(2,6,23,0.65)] backdrop-blur-2xl grid lg:grid-cols-[1.1fr,0.9fr]">
        <section className="p-8 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
            <ShieldCheck size={14} />
            Yonetim Girisi
          </div>

          <div className="mt-8 space-y-5">
            <h1 className="text-4xl sm:text-5xl font-heading font-semibold tracking-tight text-white">
              Rezervasyonlari tek panelden yonetin.
            </h1>
            <p className="max-w-xl text-slate-300 leading-relaxed">
              Bu alan public sitede gosterilmez. Erisim sadece giris yapan admin kullanicilara acilir.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white">Canli durum takibi</div>
              <p className="mt-2 text-sm text-slate-400">
                Bekleyen, onaylanan ve iptal edilen rezervasyonlari aninda gorun.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white">Tek noktadan guncelleme</div>
              <p className="mt-2 text-sm text-slate-400">
                Odeme ve rezervasyon durumlarini panel uzerinden duzenleyin.
              </p>
            </div>
          </div>
        </section>

        <section className="p-8 sm:p-10 lg:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-sm uppercase tracking-[0.28em] text-slate-400">Admin Login</div>
            <h2 className="mt-3 text-3xl font-heading font-semibold text-white">Hesabiniza girin</h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Kullanici adi</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-cyan-300/60 focus-within:bg-white/10 transition-colors">
                  <Mail size={18} className="text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="w-full bg-transparent outline-none placeholder:text-slate-500"
                    placeholder="Kullanici adiniz"
                    autoComplete="username"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Sifre</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-cyan-300/60 focus-within:bg-white/10 transition-colors">
                  <LockKeyhole size={18} className="text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full bg-transparent outline-none placeholder:text-slate-500"
                    placeholder="Sifreniz"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </label>

              {visibleError ? (
                <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                  {visibleError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-cyan-400 px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition-all hover:-translate-y-0.5 hover:bg-cyan-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Giris yapiliyor...' : 'Panele gir'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
