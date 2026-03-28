import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function RequireAdmin() {
  const location = useLocation();
  const { admin, isReady } = useAdminAuth();

  if (!isReady) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm tracking-[0.2em] uppercase text-slate-300">
          Admin panel yukleniyor
        </div>
      </div>
    );
  }

  if (!admin) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/admin/login" replace state={{ from }} />;
  }

  return <Outlet />;
}
