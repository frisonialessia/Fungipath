// Iconos de navegación del sidebar (trazo, estética cartográfica).
import type { ReactNode } from "react";

export const NAV_ICONS: Record<string, ReactNode> = {
  overview: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M2 5 L7 3 L11 5 L16 3 L16 13 L11 15 L7 13 L2 15 Z" /><path d="M7 3 L7 13 M11 5 L11 15" /></svg>,
  predict: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.6}><circle cx="9" cy="9" r="7" /><path d="M9 5 L9 9 L12 11" /></svg>,
  species: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M9 2 Q13 6 13 10 A4 4 0 0 1 5 10 Q5 6 9 2 Z" /></svg>,
  identify: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M2 6 V4 A2 2 0 0 1 4 2 H6 M12 2 H14 A2 2 0 0 1 16 4 V6 M16 12 V14 A2 2 0 0 1 14 16 H12 M6 16 H4 A2 2 0 0 1 2 14 V12" /><circle cx="9" cy="9" r="2.6" /></svg>,
  routes: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M3 14 L3 5 L7 3 L11 5 L15 3 L15 12 L11 14 L7 12 Z" /></svg>,
  climate: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M3 13 Q6 7 9 10 T15 6" /><circle cx="9" cy="4" r="2" /></svg>,
  soil: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M3 6 L15 6 M3 10 L15 10 M3 14 L15 14" /><path d="M6 6 L6 14 M11 6 L11 14" opacity=".5" /></svg>,
  calendar: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round"><rect x="3" y="4" width="12" height="11" rx="2" /><path d="M3 7.5 H15 M6 2.5 V5 M12 2.5 V5" /><circle cx="7" cy="11" r="1" fill="currentColor" stroke="none" /><circle cx="11" cy="11" r="1" fill="currentColor" stroke="none" /></svg>,
  diary: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.6}><rect x="3" y="3" width="12" height="12" rx="2" /><path d="M3 7 L15 7 M7 7 L7 15" /></svg>,
  safety: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M9 2 L15 5 V9 C15 13 12 15 9 16 C6 15 3 13 3 9 V5 Z" /><path d="M9 7 V11 M9 13 h.01" strokeLinecap="round" /></svg>,
  privacy: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.6}><rect x="4" y="8" width="10" height="7" rx="1.5" /><path d="M6 8 V6 A3 3 0 0 1 12 6 V8" /></svg>,
  settings: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="2.6" /><path d="M9 1.6v2M9 14.4v2M1.6 9h2M14.4 9h2M3.8 3.8l1.4 1.4M12.8 12.8l1.4 1.4M14.2 3.8l-1.4 1.4M5.2 12.8l-1.4 1.4" /></svg>,
  traceability: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M9 2 L3 4 V9 C3 13 6 15 9 16 C12 15 15 13 15 9 V4 Z" /><path d="M6.5 9 L8.2 10.7 L11.5 7" /></svg>,
};

export const INSIGHT_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="#f1e7db" strokeWidth={1.6}><path d="M12 3 C8 3 5 6 5 9 C5 11 6 12 7 13 L7 16 L17 16 L17 13 C18 12 19 11 19 9 C19 6 16 3 12 3 Z" /><path d="M9 19 L15 19 M10 21 L14 21" strokeLinecap="round" /></svg>
);
