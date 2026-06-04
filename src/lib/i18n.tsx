"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { MESSAGES } from "./messages";
import { DEFAULT_LOCALE, type Locale } from "./locale";
export { DEFAULT_LOCALE, tx, type Locale, type Loc } from "./locale";

interface Ctx { locale: Locale; setLocale: (l: Locale) => void; t: (key: string, vars?: Record<string, string | number>) => string; }
const LocaleCtx = createContext<Ctx>({ locale: DEFAULT_LOCALE, setLocale: () => {}, t: (k) => k });

export const useI18n = () => useContext(LocaleCtx);
export const useT = () => useContext(LocaleCtx).t;

function lookup(locale: Locale, key: string): string {
  const parts = key.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let node: any = MESSAGES[locale];
  for (const p of parts) { node = node?.[p]; if (node == null) break; }
  if (typeof node === "string") return node;
  // fallback al otro idioma si falta
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let alt: any = MESSAGES[locale === "en" ? "es" : "en"];
  for (const p of parts) { alt = alt?.[p]; if (alt == null) break; }
  return typeof alt === "string" ? alt : key;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const saved = (typeof window !== "undefined" && window.localStorage.getItem("fp_locale")) as Locale | null;
    if (saved === "en" || saved === "es") setLocaleState(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("fp_locale", l);
  }, []);

  const t = useCallback((key: string, vars?: Record<string, string | number>) => {
    let s = lookup(locale, key);
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    return s;
  }, [locale]);

  return <LocaleCtx.Provider value={{ locale, setLocale, t }}>{children}</LocaleCtx.Provider>;
}
