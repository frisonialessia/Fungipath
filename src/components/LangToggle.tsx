"use client";
import { useI18n } from "@/lib/i18n";

// Selector de idioma EN/ES. variant "dark" para sidebar oscuro, "light" para landing.
export default function LangToggle({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { locale, setLocale } = useI18n();
  const dark = variant === "dark";
  return (
    <div role="group" aria-label="Language" style={{
      display: "inline-flex", border: `1px solid ${dark ? "rgba(255,255,255,.18)" : "var(--line)"}`,
      borderRadius: 20, padding: 2, background: dark ? "rgba(255,255,255,.05)" : "var(--card)",
    }}>
      {(["en", "es"] as const).map((l) => (
        <button key={l} onClick={() => setLocale(l)} style={{
          border: "none", borderRadius: 16, padding: "4px 10px", fontSize: 12, fontWeight: 700, letterSpacing: ".5px",
          cursor: "pointer", textTransform: "uppercase",
          background: locale === l ? "var(--terracotta)" : "transparent",
          color: locale === l ? "#fff" : dark ? "#c9bba9" : "var(--ink-soft)",
        }}>{l}</button>
      ))}
    </div>
  );
}
