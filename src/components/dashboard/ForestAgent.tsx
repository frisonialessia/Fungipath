"use client";
import { useEffect, useRef, useState } from "react";
import { useT, type Locale } from "@/lib/i18n";
import { forestGuideReply, type GuideHotspot } from "@/lib/forestGuide";
import { config } from "@/lib/config";

interface Msg { role: "user" | "assistant"; content: string; }

export default function ForestAgent({
  hotspots, locale, open, setOpen, pendingAsk, onAsked,
}: {
  hotspots: GuideHotspot[]; locale: Locale;
  open: boolean; setOpen: (b: boolean) => void;
  pendingAsk: string | null; onAsked: () => void;
}) {
  const t = useT();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const greeting: Msg = { role: "assistant", content: t("agent.greeting") };
  const suggestions = [t("agent.s1"), t("agent.s2"), t("agent.s3")];

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [msgs, loading]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    setMsgs((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setLoading(true);

    // Guía LOCAL por defecto (sin coste, sin claves).
    // ¿Quieres un LLM real? Pon config.agentMode = "api" y aquí haces el fetch a
    // tu endpoint (Claude, OpenAI, …); deja el guía local como fallback.
    const reply = forestGuideReply(q, hotspots, locale);
    const delay = 500 + Math.min(900, reply.length * 4); // pequeño "pensando…"
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "assistant", content: reply }]);
      setLoading(false);
    }, delay);
  }

  useEffect(() => {
    if (open && pendingAsk) { send(pendingAsk); onAsked(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pendingAsk]);

  const shown = msgs.length ? msgs : [greeting];

  return (
    <>
      {!open && (
        <button className="agent-fab" onClick={() => setOpen(true)} aria-label={t("agent.title")}>
          <span className="ping" />
          <span className="fab-mark" aria-hidden>
            <svg viewBox="0 0 120 120"><rect width="120" height="120" rx="28" fill="#241a12" /><path d="M24 72 A36 36 0 0 1 96 72 Z" fill="#9cd147" /><g fill="#52c871"><circle cx="44" cy="94" r="6" /><circle cx="60" cy="103" r="6.5" /><circle cx="76" cy="94" r="6" /></g></svg>
          </span>
          <span className="fab-label">{locale === "en" ? "Guide" : "Guía"}</span>
        </button>
      )}
      <div className={`agent-panel${open ? " show" : ""}`}>
        <div className="agent-head">
          <div className="ava"><svg viewBox="0 0 22 22" fill="none" stroke="#f1e7db" strokeWidth={1.6}><path d="M11 3 C6 3 3 7 3 10 C3 12 4 13 4 13 L4 17 L8 15 C9 15 10 16 11 16 C16 16 19 12 19 9 C19 6 16 3 11 3 Z" /></svg></div>
          <div><h4>{t("agent.title")}</h4><small>{config.agentMode === "local" ? t("agent.statusLocal") : t("agent.status")}</small></div>
          <button className="agent-close" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="agent-body" ref={bodyRef}>
          {shown.map((m, i) => <div key={i} className={`msg ${m.role === "user" ? "user" : "bot"}`} style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>)}
          {loading && <div className="typing"><span /><span /><span /></div>}
        </div>
        {!loading && <div className="agent-sug">{suggestions.map((s) => <button key={s} className="sug-chip" onClick={() => send(s)}>{s}</button>)}</div>}
        <div className="agent-input">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("agent.placeholder")} onKeyDown={(e) => { if (e.key === "Enter") send(input); }} />
          <button onClick={() => send(input)} aria-label="Send"><svg viewBox="0 0 18 18" fill="none" stroke="#f1e7db" strokeWidth={1.8}><path d="M3 9 L15 9 M10 4 L15 9 L10 14" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
        </div>
      </div>
    </>
  );
}
