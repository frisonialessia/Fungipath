"use client";
import { useState } from "react";
import { calcProbability } from "@/lib/model";
import type { Hotspot } from "@/data/hotspots";

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const IC = ["☁️", "🌧️", "🌧️", "⛅", "☀️", "⛅", "🌧️"];
const TMP = [13, 12, 14, 15, 17, 16, 14];
const RAIN = [2, 12, 18, 4, 0, 6, 15];
const OPT = [0, 0, 1, 1, 0, 0, 0];

// MOCK (PoC): previsión de 7 días de ejemplo. El clima real (Open-Meteo) llega
// a través de /api/predict; aquí mostramos una semana de demostración + simulador.
export default function Climate({ hotspots }: { hotspots: Hotspot[] }) {
  const base = Math.round(hotspots.reduce((s, h) => s + h.prob, 0) / hotspots.length);
  const [rain, setRain] = useState(0);
  const [temp, setTemp] = useState(14);
  const sim = calcProbability({ rainMm: rain, soilTemp: temp, aspect: "N" });
  const delta = sim - base;

  return (
    <div>
      <div className="topbar"><div><h1 className="serif">Clima</h1><p>Previsión a 7 días para tu comarca. Los días óptimos para fructificación se resaltan.</p></div></div>
      <div className="card" style={{ marginBottom: 15 }}>
        <div className="climate-grid">
          {DAYS.map((d, i) => (
            <div className={`day-col${OPT[i] ? " opt" : ""}`} key={d}>
              <div className="dn">{d}</div><div className="di">{IC[i]}</div><div className="dt">{TMP[i]}°</div><div className="dr">{RAIN[i]}mm</div>
              {OPT[i] ? <div style={{ fontSize: 9, color: "var(--terracotta)", marginTop: 6, fontWeight: 700 }}>ÓPTIMO</div> : null}
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{ background: "var(--ink)", color: "var(--cream)" }}>
        <div className="panel-head"><h3 className="serif" style={{ color: "var(--cream)" }}>Simulador predictivo</h3><span style={{ color: "#b0a392" }}>¿Y si cambia el tiempo?</span></div>
        <p style={{ fontSize: 13, color: "#cabdac", marginBottom: 18 }}>Mueve los controles y mira cómo el modelo recalcula la probabilidad media de tus hotspots en vivo.</p>
        <div className="sim-row"><label>Lluvia próxima semana <b>{rain} mm</b></label><input type="range" min={0} max={80} value={rain} onChange={(e) => setRain(+e.target.value)} /></div>
        <div className="sim-row"><label>Temperatura media <b>{temp} °C</b></label><input type="range" min={4} max={28} value={temp} onChange={(e) => setTemp(+e.target.value)} /></div>
        <div className="sim-result">
          <div><div className="sim-big">{sim}%</div><div style={{ fontSize: 11, color: "#9c8f7d", textTransform: "uppercase", letterSpacing: ".5px" }}>prob. media estimada</div></div>
          <div className={`sim-delta ${delta >= 0 ? "pos" : "neg"}`}>{delta >= 0 ? "▲ +" : "▼ "}{delta} pts vs hoy</div>
        </div>
      </div>
    </div>
  );
}
