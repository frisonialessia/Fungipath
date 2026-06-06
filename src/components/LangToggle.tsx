"use client";
import { useI18n } from "@/lib/i18n";

// Selector de idioma EN/ES estilo switch deslizante. variant "dark" para sidebar.
export default function LangToggle({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { locale, setLocale } = useI18n();
  const dark = variant === "dark";
  const isEs = locale === "es";
  const next = isEs ? "en" : "es";
  const inactive = isEs ? { left: 11 } : { right: 11 };
  return (
    <button
      onClick={() => setLocale(next)}
      aria-label="Language"
      title={isEs ? "Switch to English" : "Cambiar a Español"}
      style={{
        position: "relative", width: 64, height: 30, borderRadius: 20, cursor: "pointer", flexShrink: 0,
        border: `1px solid ${dark ? "rgba(255,255,255,.18)" : "var(--line)"}`,
        background: "var(--forest)", padding: 0,
      }}
    >
      <span style={{
        position: "absolute", top: 0, height: "100%", display: "flex", alignItems: "center",
        fontSize: 11, fontWeight: 700, letterSpacing: ".5px", color: "rgba(255,255,255,.7)", ...inactive,
      }}>{next.toUpperCase()}</span>
      <span style={{
        position: "absolute", top: 3, left: isEs ? 34 : 3, width: 27, height: 22, borderRadius: 14,
        background: "#fff", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 800,
        letterSpacing: ".5px", color: "var(--forest)", transition: "left .18s cubic-bezier(.2,.8,.2,1)",
        boxShadow: "0 1px 3px rgba(0,0,0,.25)",
      }}>{locale.toUpperCase()}</span>
    </button>
  );
}
