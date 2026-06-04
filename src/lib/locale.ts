// Tipos de localización compartidos por cliente y servidor (sin "use client").
export type Locale = "en" | "es";
export const DEFAULT_LOCALE: Locale = "en"; // inglés primario, español secundario
export interface Loc { en: string; es: string }
export const tx = (l: Loc, locale: Locale): string => l[locale];
