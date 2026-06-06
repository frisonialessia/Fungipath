"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import LangToggle from "@/components/LangToggle";
import { localizedHotspots, localizedDiary, type Hotspot, type DiaryEntry, type Privacy as Priv } from "@/data/hotspots";
import { useI18n } from "@/lib/i18n";
import { ToastProvider } from "./shared";
import { NAV_ICONS } from "./icons";
import ForestAgent from "./ForestAgent";
import OnboardingTour from "./OnboardingTour";
import NewHotspotModal from "./NewHotspotModal";
import ParcelModal from "./ParcelModal";
import { centroid, type Parcel } from "@/data/parcels";
import Overview from "./sections/Overview";
import Predictions from "./sections/Predictions";
import Model from "./sections/Model";
import Species from "./sections/Species";
import Identify from "./sections/Identify";
import Routes from "./sections/Routes";
import Community from "./sections/Community";
import Climate from "./sections/Climate";
import Soil from "./sections/Soil";
import Calendar from "./sections/Calendar";
import Diary from "./sections/Diary";
import Safety from "./sections/Safety";
import Privacy from "./sections/Privacy";
import Business from "./sections/Business";
import Settings from "./sections/Settings";

type SectionId = "overview" | "predict" | "model" | "species" | "identify" | "routes" | "community" | "climate" | "soil" | "calendar" | "diary" | "safety" | "privacy" | "traceability" | "settings";

const NAV: { group: "explore" | "data" | "business" | "account"; items: SectionId[] }[] = [
  { group: "explore", items: ["overview", "predict", "model", "species", "identify", "routes", "community"] },
  { group: "data", items: ["climate", "soil", "calendar", "diary", "safety", "privacy"] },
  { group: "business", items: ["traceability"] },
  { group: "account", items: ["settings"] },
];

// Acento de color por sección · Opción 4 "familia verde sutil" (punto del sidebar / pill)
const SECTION_ACCENT: Record<SectionId, string> = {
  overview: "#52c871", predict: "#507d3e", model: "#318c6f", species: "#9cd147",
  identify: "#d19eef", routes: "#ffa143", community: "#b4e8c5", climate: "#318c6f",
  soil: "#507d3e", calendar: "#9cd147", diary: "#52c871", safety: "#fc3a3a",
  privacy: "#318c6f", traceability: "#6d482b", settings: "#52c871",
};
// Variante legible del mismo acento para usar DENTRO de la página (texto/bordes/círculos
// sobre fondo claro). Cada página tiñe sus elementos con su color, sin naranja global.
const SECTION_PAGE: Record<SectionId, string> = {
  overview: "#2e9e57", predict: "#507d3e", model: "#318c6f", species: "#6f9e2f",
  identify: "#9b6fd4", routes: "#e0801f", community: "#2e9e57", climate: "#318c6f",
  soil: "#6d482b", calendar: "#6f9e2f", diary: "#2e9e57", safety: "#d62f2f",
  privacy: "#318c6f", traceability: "#6d482b", settings: "#2e9e57",
};

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

// Persistencia local (sin backend): la app recuerda todo en el navegador.
const ls = {
  get<T>(k: string): T | null { try { if (typeof window === "undefined") return null; const v = localStorage.getItem(k); return v ? JSON.parse(v) as T : null; } catch { return null; } },
  set(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* noop */ } },
};

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
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [mapMode, setMapMode] = useState<"pin" | "parcel">("pin");
  const [pendingParcel, setPendingParcel] = useState<[number, number][] | null>(null);
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);

  // Persistencia local: solo guardamos tras la primera acción del usuario, para que
  // un visitante nuevo siga viendo el seed traducido al cambiar de idioma.
  const touchedRef = useRef(false);
  useEffect(() => { touchedRef.current = !!ls.get("fp_touched"); }, []);
  function markTouched() { touchedRef.current = true; ls.set("fp_touched", 1); }
  useEffect(() => { if (touchedRef.current) ls.set("fp_hotspots", hotspots); }, [hotspots]);
  useEffect(() => { if (touchedRef.current) ls.set("fp_diary", diary); }, [diary]);
  useEffect(() => { if (touchedRef.current) ls.set("fp_parcels", parcels); }, [parcels]);

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
      if (!base) {
        // si el usuario ya tocó algo, restauramos lo guardado; si no, seed localizado
        const saved = ls.get<boolean>("fp_touched") ? ls.get<Hotspot[]>("fp_hotspots") : null;
        base = saved && saved.length ? saved : localizedHotspots(locale);
        setSource("mock");
      }
      if (cancelled) return;
      setHotspots(base);
      const savedDiary = ls.get<boolean>("fp_touched") ? ls.get<DiaryEntry[]>("fp_diary") : null;
      setDiary(savedDiary && savedDiary.length ? savedDiary : localizedDiary(locale));
      const savedParcels = ls.get<boolean>("fp_touched") ? ls.get<Parcel[]>("fp_parcels") : null;
      if (savedParcels && savedParcels.length) setParcels(savedParcels);
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
    markTouched();
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

  // Crear parcela dibujada: centroide → predicción real (Open-Meteo).
  function handleCreateParcel(name: string, species: string, notes: string) {
    if (!pendingParcel || pendingParcel.length < 3) { setPendingParcel(null); return; }
    markTouched();
    const [lat, lng] = centroid(pendingParcel);
    const id = "p" + Date.now();
    const parcel: Parcel = { id, name, species, notes, points: pendingParcel, lat, lng, aspect: "N", prob: 0, why: t("modal.calcReal"), live: false };
    setParcels((ps) => [...ps, parcel]);
    setSelectedParcelId(id);
    setPendingParcel(null);
    setMapMode("pin");
    (async () => {
      try {
        const r = await fetch("/api/predict/batch", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang: locale, points: [{ lat, lng, aspect: "N", species }] }),
        });
        const data = await r.json();
        const res = data?.results?.[0];
        if (res) setParcels((ps) => ps.map((x) => x.id === id ? { ...x, prob: res.probability, why: res.explanation, live: true, rainMm: res.factors.rainMm, soilTemp: res.factors.soilTemp, daysSinceRain: res.factors.daysSinceRain, windowDays: res.windowDays } : x));
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
          <div className="nav-scroll">
            {NAV.map((g) => (
              <div key={g.group}>
                <div className="nav-label">{t(`nav.${g.group}`)}</div>
                {g.items.map((id) => (
                  <button key={id} className={`nav-item${active === id ? " active" : ""}`} onClick={() => go(id)} style={{ "--acc": SECTION_ACCENT[id] } as CSSProperties}>
                    <span className="ic">{NAV_ICONS[id]}</span>{t(`nav.${id}`)}
                    <span className="nav-dot" />
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="sidebar-lang">
            <span className="sl-label">{locale === "en" ? "Language" : "Idioma"}</span>
            <LangToggle variant="dark" />
          </div>
          <div className="sidebar-foot" style={{ cursor: "pointer" }} onClick={() => go("settings")} title={t("nav.settings")}>
            <div className="avatar">{t("nav.user").charAt(0)}</div>
            <div><strong style={{ fontSize: 13 }}>{t("nav.user")}</strong><small>{t("nav.plan")}</small></div>
          </div>
          <Link href="/" className="back-link">{t("nav.back")}</Link>
        </aside>

        <main className="main" style={{ "--page": SECTION_PAGE[active] } as CSSProperties}>
          <div className="loadbar" data-on={predicting} aria-hidden />
          {active === "overview" && <Overview hotspots={hotspots} selectedIdx={selectedIdx} setSelectedIdx={(i) => { setSelectedIdx(i); setSelectedParcelId(null); }} diary={diary} onNewHotspot={() => { setPendingCoords(null); setNewModal(true); }} onAskGuide={() => askGuide()} onMapCreate={openMapCreate} predicting={predicting} live={live} source={source}
            parcels={parcels} mapMode={mapMode} setMapMode={setMapMode} onParcelComplete={(pts) => setPendingParcel(pts)} selectedParcelId={selectedParcelId} onSelectParcel={setSelectedParcelId} />}
          {active === "predict" && <Predictions hotspots={hotspots} />}
          {active === "model" && <Model hotspots={hotspots} diary={diary} />}
          {active === "species" && <Species onAskGuide={askGuide} />}
          {active === "identify" && <Identify onAskGuide={askGuide} />}
          {active === "routes" && <Routes />}
          {active === "community" && <Community />}
          {active === "climate" && <Climate hotspots={hotspots} />}
          {active === "soil" && <Soil hotspots={hotspots} />}
          {active === "calendar" && <Calendar />}
          {active === "diary" && <Diary diary={diary} hotspots={hotspots} onAddLog={(e) => { markTouched(); setDiary((d) => [e, ...d]); }} />}
          {active === "safety" && <Safety />}
          {active === "privacy" && <Privacy hotspots={hotspots} onSetPriv={(i, v: Priv) => { markTouched(); setHotspots((hs) => hs.map((h, idx) => idx === i ? { ...h, priv: v } : h)); }} />}
          {active === "traceability" && <Business hotspots={hotspots} />}
          {active === "settings" && <Settings hotspots={hotspots} />}
        </main>
      </div>

      <ForestAgent hotspots={agentHotspots} locale={locale} open={agentOpen} setOpen={setAgentOpen} pendingAsk={agentAsk} onAsked={() => setAgentAsk(null)} />
      <OnboardingTour />

      {newModal && (
        <NewHotspotModal coords={pendingCoords ?? undefined} onClose={() => { setNewModal(false); setPendingCoords(null); }} onCreate={handleCreate} />
      )}
      {pendingParcel && (
        <ParcelModal points={pendingParcel} onClose={() => setPendingParcel(null)} onCreate={handleCreateParcel} />
      )}
    </ToastProvider>
  );
}
