"use client";
import { useEffect, useState } from "react";

// Registra el service worker (offline) y ofrece instalar la PWA cuando el navegador
// lo permite. Sin backend, sin coste.
interface BIPEvent extends Event { prompt: () => void; userChoice: Promise<{ outcome: string }>; }

export default function PwaRegister() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const onPrompt = (e: Event) => { e.preventDefault(); setDeferred(e as BIPEvent); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!deferred) return null;
  return (
    <button
      onClick={() => { deferred.prompt(); deferred.userChoice.finally(() => setDeferred(null)); }}
      style={{
        position: "fixed", bottom: 24, left: 24, zIndex: 1400,
        background: "var(--umber)", color: "var(--cream)", border: "none",
        borderRadius: 30, padding: "11px 20px", fontWeight: 600, fontSize: 14,
        boxShadow: "0 8px 24px rgba(46,35,27,.25)", display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
      }}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 11l5 5 5-5M5 21h14" /></svg>
      Install app
    </button>
  );
}
