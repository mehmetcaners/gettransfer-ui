import { LayoutDashboard, LogOut, ReceiptText, ShieldCheck } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const navItems = [
  { to: '/admin/dashboard', label: 'Genel Bakis', Icon: LayoutDashboard },
  { to: '/admin/bookings', label: 'Rezervasyonlar', Icon: ReceiptText },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 flex items-center justify-center text-cyan-200">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">GetTransfer</div>
              <div className="text-2xl font-heading font-semibold text-white">Admin Panel</div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <nav className="flex flex-wrap gap-2">
              {navItems.map(({ to, label, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Oturum</div>
                <div className="text-sm font-medium text-white">{admin?.username ?? '-'}</div>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/10 transition-colors"
              >
                <LogOut size={16} />
                <span>Cikis</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
