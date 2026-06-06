"use client";
import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";

// Renderiza un string SVG (p. ej. spIllust) de forma segura dentro de un span.
export function Illu({ html, className, style }: { html: string; className?: string; style?: React.CSSProperties }) {
  return <span className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />;
}

// Estado vacío reutilizable (icono de marca + título + texto + acción opcional).
export function EmptyState({ title, text, cta, onCta }: { title: string; text?: string; cta?: string; onCta?: () => void }) {
  return (
    <div className="empty">
      <span className="empty-ic" aria-hidden>
        <svg viewBox="0 0 120 120"><rect width="120" height="120" rx="28" fill="#241a12" /><path d="M24 72 A36 36 0 0 1 96 72 Z" fill="#9cd147" /><g fill="#52c871"><circle cx="44" cy="94" r="6" /><circle cx="60" cy="103" r="6.5" /><circle cx="76" cy="94" r="6" /></g></svg>
      </span>
      <div className="empty-t">{title}</div>
      {text ? <div className="empty-s">{text}</div> : null}
      {cta ? <button className="btn empty-cta" onClick={onCta}>{cta}</button> : null}
    </div>
  );
}

// ---- Toast global del dashboard ----
const ToastCtx = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useCallback((m: string) => {
    setMsg(m); setShow(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 2600);
  }, []);
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className={`toast${show ? " show" : ""}`}><span className="dot" /><span>{msg}</span></div>
    </ToastCtx.Provider>
  );
}
