"use client";

// Global language state via React Context.
//
// Design decisions:
// 1. "use client" — Context only works in the client tree. The Provider is
//    rendered inside layout.tsx which is a Server Component; Next.js handles
//    this boundary automatically.
// 2. localStorage persistence — lang choice survives hard refresh.
//    We read it with an initializer function to avoid a flicker on first render.
// 3. The Provider also pre-resolves the full Dictionary so consumers only need
//    one import: `const { t, lang, setLang } = useLanguage()`.
// 4. Cookie write (optional, shown as comment) — enables Server Components to
//    read the language if you ever need SSR-aware translations in the future.

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

import { getDictionary, type Lang, type Dictionary } from "@/i18n";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LanguageContextValue {
  /** Active language code */
  lang: Lang;
  /** Full translation dictionary for the active language */
  t: Dictionary;
  /** Toggle between 'bn' and 'en' */
  toggleLang: () => void;
  /** Set a specific language directly */
  setLang: (lang: Lang) => void;
}

// ─── Storage key ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "tirtha_lang";
const DEFAULT_LANG: Lang = "bn"; // Bengali is the default

// ─── Safe localStorage read (guards against SSR and private browsing) ─────────

function readStoredLang(): Lang {
  if (typeof window === "undefined") return DEFAULT_LANG;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "en" || stored === "bn" ? stored : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const LanguageContext = createContext<LanguageContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage synchronously on mount to avoid a flicker
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Hydrate from localStorage after mount (runs once, client-only)
  useEffect(() => {
    setLangState(readStoredLang());
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      // Optional: also write a cookie so Server Components can read it in future
      // document.cookie = `${STORAGE_KEY}=${newLang}; path=/; max-age=31536000`;
    } catch {
      // localStorage blocked (private mode, storage full) — state still updates
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "bn" ? "en" : "bn");
  }, [lang, setLang]);

  // Memoize the full dictionary so it's only recomputed when lang changes,
  // not on every render of any consumer
  const t = useMemo(() => getDictionary(lang), [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, t, toggleLang, setLang }),
    [lang, t, toggleLang, setLang],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside <LanguageProvider>.");
  }
  return ctx;
}
