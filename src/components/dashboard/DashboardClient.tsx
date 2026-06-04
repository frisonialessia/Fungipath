"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import LangToggle from "@/components/LangToggle";
import { localizedHotspots, localizedDiary, type Hotspot, type DiaryEntry, type Privacy as Priv } from "@/data/hotspots";
import { useI18n } from "@/lib/i18n";
import { ToastProvider } from "./shared";
import { NAV_ICONS } from "./icons";
import ForestAgent from "./ForestAgent";
import NewHotspotModal from "./NewHotspotModal";
import Overview from "./sections/Overview";
import Predictions from "./sections/Predictions";
import Species from "./sections/Species";
import Routes from "./sections/Routes";
import Climate from "./sections/Climate";
import Soil from "./sections/Soil";
import Diary from "./sections/Diary";
import Safety from "./sections/Safety";
import Privacy from "./sections/Privacy";

type SectionId = "overview" | "predict" | "species" | "routes" | "climate" | "soil" | "diary" | "safety" | "privacy";

const NAV: { group: "explore" | "data"; items: SectionId[] }[] = [
  { group: "explore", items: ["overview", "predict", "species", "routes"] },
  { group: "data", items: ["climate", "soil", "diary", "safety", "privacy"] },
];

interface PredResult {
  probability: number; explanation: string; windowDays: number; elevation: number;
  factors: { rainMm: number; soilTemp: number; daysSinceRain: number };
}

// Aplica una predicción real (Open-Meteo + modelo) sobre un hotspot.
function applyPrediction(h: Hotspot, res: PredResult): Hotspot {
  return {
    ...h,
    prob: res.probability, why: res.explanation, live: true,
    alt: res.elevation && res.elevation > 0 ? res.elevation : h.alt,
    rainMm: res.factors.rainMm, soilTemp: res.factors.soilTemp,
    daysSinceRain: res.factors.daysSinceRain, windowDays: res.windowDays,
    factors: [
      ["rain", `${res.factors.rainMm}mm`],
      ["soilTemp", `${res.factors.soilTemp} °C`],
      ["aspect", h.aspect],
      ["window", `~${res.windowDays}d`],
    ],
  };
}

// Mapea una fila de Supabase (demo_hotspots) a un Hotspot del cliente.
interface DbRow { name: string; species: string; altitude: number | null; aspect: Hotspot["aspect"]; habitat: string | null; lat: number; lng: number; privacy: Priv; }
function dbToHotspot(r: DbRow): Hotspot {
  return { name: r.name, species: r.species, alt: r.altitude ?? 0, aspect: r.aspect, habitat: r.habitat ?? "", prob: 0, lat: r.lat, lng: r.lng, priv: r.privacy ?? "private", why: "", factors: [] };
}

export default function DashboardClient() {
  const { locale, t } = useI18n();
  const [hotspots, setHotspots] = useState<Hotspot[]>(() => localizedHotspots(locale));
  const [diary, setDiary] = useState<DiaryEntry[]>(() => localizedDiary(locale));
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [active, setActive] = useState<SectionId>("overview");
  const [newModal, setNewModal] = useState(false);
  const [pendingCoords, setPendingCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [agentOpen, setAgentOpen] = useState(false);
  const [agentAsk, setAgentAsk] = useState<string | null>(null);
  const [predicting, setPredicting] = useState(true);
  const [live, setLive] = useState(false);
  const [source, setSource] = useState<"db" | "mock">("mock");
  const [navOpen, setNavOpen] = useState(false); // drawer móvil

  // Motor de datos + predicción. Al cargar y al cambiar idioma:
  // 1) intenta leer hotspots de Supabase; si no hay, cae al seed mock localizado.
  // 2) predice EN LOTE con clima real de Open-Meteo en el idioma activo.
  useEffect(() => {
    let cancelled = false;
    setPredicting(true);
    (async () => {
      // 1) Supabase (motor de datos)
      let base: Hotspot[] | null = null;
      try {
        const hr = await fetch("/api/hotspots");
        const hd = await hr.json();
        if (hd.configured && Array.isArray(hd.hotspots) && hd.hotspots.length) {
          base = hd.hotspots.map(dbToHotspot); setSource("db");
        }
      } catch { /* sin red: fallback abajo */ }
      if (!base) { base = localizedHotspots(locale); setSource("mock"); }
      if (cancelled) return;
      setHotspots(base);
      setDiary(localizedDiary(locale));
      // 2) predicción en lote con clima real
      try {
        const r = await fetch("/api/predict/batch", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang: locale, points: base.map((h) => ({ lat: h.lat, lng: h.lng, aspect: h.aspect, species: h.species })) }),
        });
        const data = await r.json();
        if (cancelled || !Array.isArray(data.results)) { setPredicting(false); return; }
        setHotspots((hs) => hs.map((h, i) => data.results[i] ? applyPrediction(h, data.results[i]) : h));
        if (data.results.some((x: unknown) => x)) setLive(true);
      } catch { /* sin red: se queda sin predicción en vivo */ }
      finally { if (!cancelled) setPredicting(false); }
    })();
    return () => { cancelled = true; };
  }, [locale]);

  const agentHotspots = hotspots.map((h) => ({ name: h.name, species: h.species, prob: h.prob, why: h.why, alt: h.alt, aspect: h.aspect }));

  function askGuide(name?: string) {
    if (name) setAgentAsk(t("agent.askAbout", { name }));
    setAgentOpen(true);
  }
  function openMapCreate(lat: number, lng: number) { setPendingCoords({ lat, lng }); setNewModal(true); }

  function handleCreate(h: Hotspot, enrich: boolean) {
    let newIndex = 0;
    setHotspots((hs) => { const next = [...hs, h]; newIndex = next.length - 1; return next; });
    setSelectedIdx(hotspots.length);
    // Persistir en Supabase (best-effort; si no está configurado, no pasa nada)
    fetch("/api/hotspots", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: h.name, species: h.species, altitude: h.alt, aspect: h.aspect, habitat: h.habitat, lat: h.lat, lng: h.lng, privacy: h.priv }),
    }).catch(() => {});
    if (!enrich) return;
    (async () => {
      try {
        const r = await fetch("/api/predict/batch", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang: locale, points: [{ lat: h.lat, lng: h.lng, aspect: h.aspect, species: h.species }] }),
        });
        const data = await r.json();
        const res = data?.results?.[0];
        if (res) { setHotspots((hs) => hs.map((x, i) => i === newIndex ? applyPrediction(x, res) : x)); setLive(true); }
      } catch { /* sin red */ }
    })();
  }

  function go(id: SectionId) { setActive(id); setNavOpen(false); window.scrollTo(0, 0); }

  return (
    <ToastProvider>
      <div className="shell">
        {/* Top bar móvil */}
        <div className="mobile-bar">
          <button className="hamburger" onClick={() => setNavOpen((v) => !v)} aria-label="Menu">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
          <div className="brand"><Logo size={26} /><b>FungiPath</b></div>
          <LangToggle variant="dark" />
        </div>

        {navOpen && <div className="nav-scrim" onClick={() => setNavOpen(false)} />}
        <aside className={`sidebar${navOpen ? " open" : ""}`}>
          <div className="brand"><Logo /><b>FungiPath</b></div>
          {NAV.map((g) => (
            <div key={g.group}>
              <div className="nav-label">{t(`nav.${g.group}`)}</div>
              {g.items.map((id) => (
                <button key={id} className={`nav-item${active === id ? " active" : ""}`} onClick={() => go(id)}>
                  <span className="ic">{NAV_ICONS[id]}</span>{t(`nav.${id}`)}
                </button>
              ))}
            </div>
          ))}
          <div style={{ marginTop: 16 }}><LangToggle variant="dark" /></div>
          <div className="sidebar-foot">
            <div className="avatar">{t("nav.user").charAt(0)}</div>
            <div><strong style={{ fontSize: 13 }}>{t("nav.user")}</strong><small>{t("nav.plan")}</small></div>
          </div>
          <Link href="/" className="back-link">{t("nav.back")}</Link>
        </aside>

        <main className="main">
          {active === "overview" && <Overview hotspots={hotspots} selectedIdx={selectedIdx} setSelectedIdx={setSelectedIdx} diary={diary} onNewHotspot={() => { setPendingCoords(null); setNewModal(true); }} onAskGuide={() => askGuide()} onMapCreate={openMapCreate} predicting={predicting} live={live} source={source} />}
          {active === "predict" && <Predictions hotspots={hotspots} />}
          {active === "species" && <Species onAskGuide={askGuide} />}
          {active === "routes" && <Routes hotspots={hotspots} />}
          {active === "climate" && <Climate hotspots={hotspots} />}
          {active === "soil" && <Soil />}
          {active === "diary" && <Diary diary={diary} hotspots={hotspots} onAddLog={(e) => setDiary((d) => [e, ...d])} />}
          {active === "safety" && <Safety />}
          {active === "privacy" && <Privacy hotspots={hotspots} onSetPriv={(i, v: Priv) => setHotspots((hs) => hs.map((h, idx) => idx === i ? { ...h, priv: v } : h))} />}
        </main>
      </div>

      <ForestAgent hotspots={agentHotspots} locale={locale} open={agentOpen} setOpen={setAgentOpen} pendingAsk={agentAsk} onAsked={() => setAgentAsk(null)} />

      {newModal && (
        <NewHotspotModal coords={pendingCoords ?? undefined} onClose={() => { setNewModal(false); setPendingCoords(null); }} onCreate={handleCreate} />
      )}
    </ToastProvider>
  );
}
