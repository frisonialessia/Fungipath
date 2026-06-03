"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { MapHotspot } from "@/components/FungiMap";

const FungiMap = dynamic(() => import("@/components/FungiMap"), { ssr: false });

const DEMO: MapHotspot[] = [
  { id: "1", name: "Hayedo del norte", species: "Boletus edulis", prob: 91, lat: 45.92, lng: 9.18, alt: 920 },
  { id: "2", name: "Robledal del río", species: "Cantharellus cibarius", prob: 74, lat: 45.78, lng: 9.32, alt: 640 },
  { id: "3", name: "Pinar alto", species: "Lactarius deliciosus", prob: 58, lat: 46.05, lng: 9.45, alt: 1150 },
];

export default function Dashboard() {
  const [hotspots] = useState<MapHotspot[]>(DEMO);
  const [sel, setSel] = useState<MapHotspot>(DEMO[0]);
  const [live, setLive] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const predict = useCallback(async (h: MapHotspot) => {
    setLoading(true); setLive(null);
    try {
      const r = await fetch(`/api/predict?lat=${h.lat}&lng=${h.lng}&aspect=N&species=${encodeURIComponent(h.species)}`);
      setLive(await r.json());
    } catch { /* noop */ }
    setLoading(false);
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh" }}>
      <aside style={{ background: "var(--ink)", color: "var(--cream)", padding: 24 }}>
        <div className="serif" style={{ fontWeight: 600, fontSize: 22, marginBottom: 30 }}>FungiPath</div>
        {["Mapa de hotspots", "Predicciones", "Especies", "Clima", "Seguridad en ruta"].map((x, i) => (
          <div key={i} style={{ padding: "11px 14px", borderRadius: 10, marginBottom: 4, background: i === 0 ? "var(--terracotta)" : "transparent", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>{x}</div>
        ))}
      </aside>

      <main style={{ padding: 28, background: "var(--cream)" }}>
        <h1 className="serif" style={{ fontSize: 30, marginBottom: 4 }}>Mapa de hotspots</h1>
        <p style={{ color: "var(--stone)", marginBottom: 20 }}>Mapa real (OpenStreetMap). Toca un pin para predecir con datos de clima en vivo.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
          <div style={{ position: "relative", height: 420, borderRadius: 14, overflow: "hidden", border: "1px solid var(--sand)" }}>
            <FungiMap hotspots={hotspots} onSelect={(id) => { const h = hotspots.find(x => x.id === id)!; setSel(h); predict(h); }} />
          </div>

          <div style={{ background: "var(--ink)", color: "var(--cream)", borderRadius: 16, padding: 22 }}>
            <div className="serif" style={{ fontStyle: "italic", fontSize: 20 }}>{sel.species}</div>
            <div style={{ fontSize: 12, color: "#b0a392", marginBottom: 16 }}>{sel.name} · {sel.alt} m</div>
            <button className="btn" onClick={() => predict(sel)} style={{ marginBottom: 18 }}>
              {loading ? "Calculando…" : "Predecir con clima en vivo"}
            </button>
            {live && !live.error && (
              <div>
                <div className="serif" style={{ fontWeight: 700, fontSize: 46, color: "var(--terracotta)", lineHeight: 1 }}>{live.probability}%</div>
                <p style={{ fontSize: 13, color: "#cabdac", marginTop: 12, lineHeight: 1.5 }}>{live.explanation}</p>
                <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                  <span style={{ background: "rgba(255,255,255,.08)", borderRadius: 7, padding: "5px 9px", fontSize: 11 }}>Lluvia {live.factors.rainMm}mm</span>
                  <span style={{ background: "rgba(255,255,255,.08)", borderRadius: 7, padding: "5px 9px", fontSize: 11 }}>Suelo {live.factors.soilTemp}°C</span>
                  <span style={{ background: "rgba(255,255,255,.08)", borderRadius: 7, padding: "5px 9px", fontSize: 11 }}>Ventana ~{live.windowDays}d</span>
                </div>
              </div>
            )}
            {live?.error && <p style={{ color: "#e0a", fontSize: 12 }}>Error: {live.error}</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
