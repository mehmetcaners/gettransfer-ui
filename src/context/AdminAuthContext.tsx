import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  adminLogin,
  fetchAdminMe,
  type AdminLoginResponse,
  type AdminUser,
} from '../lib/adminApi';

type AdminAuthContextValue = {
  admin: AdminUser | null;
  token: string | null;
  isReady: boolean;
  isSubmitting: boolean;
  authError: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<AdminLoginResponse>;
  logout: () => void;
};

const STORAGE_KEY = 'gt-admin-token';
const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    return window.localStorage.getItem(STORAGE_KEY);
  });
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function hydrateSession() {
      if (!token) {
        if (!cancelled) {
          setAdmin(null);
          setIsReady(true);
        }
        return;
      }

      if (!cancelled) {
        setIsReady(false);
      }

      try {
        const currentAdmin = await fetchAdminMe(token);
        if (cancelled) return;
        setAdmin(currentAdmin);
        setAuthError(null);
      } catch (error) {
        if (cancelled) return;
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(STORAGE_KEY);
        }
        setToken(null);
        setAdmin(null);
        setAuthError(error instanceof Error ? error.message : 'Oturum dogrulanamadi.');
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    }

    void hydrateSession();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = async (username: string, password: string) => {
    setIsSubmitting(true);
    try {
      const response = await adminLogin(username, password);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, response.accessToken);
      }
      setToken(response.accessToken);
      setAdmin(response.admin);
      setAuthError(null);
      setIsReady(true);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Giris yapilamadi.';
      setAuthError(message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setToken(null);
    setAdmin(null);
    setAuthError(null);
    setIsReady(true);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isReady,
        isSubmitting,
        authError,
        isAuthenticated: Boolean(admin && token),
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
