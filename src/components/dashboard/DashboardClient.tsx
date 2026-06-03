"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { MOCK_HOTSPOTS, MOCK_DIARY, ASPECT_NAME, type Hotspot, type DiaryEntry, type Privacy as Priv } from "@/data/hotspots";
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

const NAV: { group: string; items: { id: SectionId; label: string }[] }[] = [
  { group: "Exploración", items: [
    { id: "overview", label: "Mapa de hotspots" }, { id: "predict", label: "Predicciones" },
    { id: "species", label: "Especies" }, { id: "routes", label: "Rutas óptimas" },
  ] },
  { group: "Datos", items: [
    { id: "climate", label: "Clima" }, { id: "soil", label: "Suelo & terreno" },
    { id: "diary", label: "Diario de cosecha" }, { id: "safety", label: "Seguridad en ruta" },
    { id: "privacy", label: "Privacidad" },
  ] },
];

export default function DashboardClient() {
  const [hotspots, setHotspots] = useState<Hotspot[]>(MOCK_HOTSPOTS); // MOCK (PoC): luego desde Supabase
  const [diary, setDiary] = useState<DiaryEntry[]>(MOCK_DIARY);       // MOCK (PoC)
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [active, setActive] = useState<SectionId>("overview");
  const [newModal, setNewModal] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);
  const [agentAsk, setAgentAsk] = useState<string | null>(null);
  const [predicting, setPredicting] = useState(true);
  const [live, setLive] = useState(false);

  // Sprint 2 · Predicción EN LOTE al cargar: clima real de Open-Meteo para todos
  // los hotspots iniciales, no solo al hacer clic. Si falla, se queda el mock.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/predict/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ points: MOCK_HOTSPOTS.map((h) => ({ lat: h.lat, lng: h.lng, aspect: h.aspect, species: h.species })) }),
        });
        const data = await r.json();
        if (cancelled || !Array.isArray(data.results)) { setPredicting(false); return; }
        setHotspots((hs) => hs.map((h, i) => {
          const res = data.results[i];
          if (!res) return h; // ese punto falló: conserva el mock
          return {
            ...h,
            prob: res.probability,
            why: res.explanation,
            live: true,
            rainMm: res.factors.rainMm,
            soilTemp: res.factors.soilTemp,
            daysSinceRain: res.factors.daysSinceRain,
            windowDays: res.windowDays,
            factors: [
              ["Lluvia", `${res.factors.rainMm}mm`],
              ["Temp suelo", `${res.factors.soilTemp} °C`],
              ["Orientación", ASPECT_NAME[h.aspect]],
              ["Ventana", `~${res.windowDays}d`],
            ],
          };
        }));
        if (data.results.some((x: unknown) => x)) setLive(true);
      } catch {
        // sin red / rate limit: nos quedamos con los datos mock
      } finally {
        if (!cancelled) setPredicting(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // contexto para el agente: resumen de hotspots del usuario
  const agentContext = {
    hotspots: hotspots.map((h) => ({ name: h.name, species: h.species, prob: h.prob, alt: h.alt, aspect: h.aspect, why: h.why })),
    diary,
  };

  function askGuide(name?: string) {
    if (name) setAgentAsk("Háblame de " + name);
    setAgentOpen(true);
  }

  return (
    <ToastProvider>
      <div className="shell">
        <aside className="sidebar">
          <div className="brand"><Logo /><b>FungiPath</b></div>
          {NAV.map((g) => (
            <div key={g.group}>
              <div className="nav-label">{g.group}</div>
              {g.items.map((it) => (
                <button key={it.id} className={`nav-item${active === it.id ? " active" : ""}`} onClick={() => { setActive(it.id); window.scrollTo(0, 0); }}>
                  <span className="ic">{NAV_ICONS[it.id]}</span>{it.label}
                </button>
              ))}
            </div>
          ))}
          <div className="sidebar-foot">
            <div className="avatar">E</div>
            <div><strong style={{ fontSize: 13 }}>Explorador</strong><small>Plan Demo</small></div>
          </div>
          <Link href="/" className="back-link">← Volver a la landing</Link>
        </aside>

        <main className="main">
          {active === "overview" && <Overview hotspots={hotspots} selectedIdx={selectedIdx} setSelectedIdx={setSelectedIdx} diary={diary} onNewHotspot={() => setNewModal(true)} onAskGuide={() => askGuide()} predicting={predicting} live={live} />}
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

      <ForestAgent context={agentContext} open={agentOpen} setOpen={setAgentOpen} pendingAsk={agentAsk} onAsked={() => setAgentAsk(null)} />

      {newModal && (
        <NewHotspotModal
          onClose={() => setNewModal(false)}
          onCreate={(h) => { setHotspots((hs) => { const next = [...hs, h]; setSelectedIdx(next.length - 1); return next; }); }}
        />
      )}
    </ToastProvider>
  );
}
