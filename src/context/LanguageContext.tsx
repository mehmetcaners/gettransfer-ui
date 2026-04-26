import {
  translations,
  type LanguageCode,
  type NavKey,
  type TranslationContent,
} from '../locales/translations';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type { LanguageCode, NavKey };

export type LanguageOption = {
  code: LanguageCode;
  label: string;
  name: string;
  flag: string;
};

const LANGUAGE_STORAGE_KEY = 'gt-language';
const LANGUAGE_EXPLICIT_STORAGE_KEY = 'gt-language-explicit';
const DEFAULT_LANGUAGE: LanguageCode = 'en';

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  languages: LanguageOption[];
  dictionary: TranslationContent;
  locale: string;
  direction: 'ltr' | 'rtl';
};

const languageOptions: LanguageOption[] = Object.entries(translations).map(([code, data]) => ({
  code: code as LanguageCode,
  label: data.meta.label,
  name: data.meta.name,
  flag: data.meta.flag,
}));

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_LANGUAGE;
    }
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const isExplicit = window.localStorage.getItem(LANGUAGE_EXPLICIT_STORAGE_KEY) === 'true';

    if (stored && Object.prototype.hasOwnProperty.call(translations, stored) && (isExplicit || stored !== 'tr')) {
      return stored as LanguageCode;
    }

    return DEFAULT_LANGUAGE;
  });

  const setLanguage = useCallback((code: LanguageCode) => {
    setLanguageState(code);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
      window.localStorage.setItem(LANGUAGE_EXPLICIT_STORAGE_KEY, 'true');
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = translations[language].meta.direction;
    }
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => {
    const data = translations[language];
    return {
      language,
      setLanguage,
      languages: languageOptions,
      dictionary: data.dictionary,
      locale: data.meta.locale,
      direction: data.meta.direction,
    };
  }, [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
