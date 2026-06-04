"use client";
import { useState } from "react";
import { calcProbability } from "@/lib/model";
import type { Hotspot } from "@/data/hotspots";
import { weatherIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n";

const IC = ["cloud", "rain", "rain", "cloud-sun", "sun", "cloud-sun", "rain"];
const TMP = [13, 12, 14, 15, 17, 16, 14];
const RAIN = [2, 12, 18, 4, 0, 6, 15];
const OPT = [0, 0, 1, 1, 0, 0, 0];

// MOCK (PoC): previsión de 7 días de ejemplo. El clima real (Open-Meteo) llega
// a través de /api/predict; aquí mostramos una semana de demostración + simulador.
export default function Climate({ hotspots }: { hotspots: Hotspot[] }) {
  const { t } = useI18n();
  const DAYS = t("climate.daysCsv").split(",");
  const base = Math.round(hotspots.reduce((s, h) => s + h.prob, 0) / hotspots.length);
  const [rain, setRain] = useState(0);
  const [temp, setTemp] = useState(14);
  const sim = calcProbability({ rainMm: rain, soilTemp: temp, aspect: "N" });
  const delta = sim - base;

  return (
    <div>
      <div className="topbar"><div><h1 className="serif">{t("climate.title")}</h1><p>{t("climate.sub")}</p></div></div>
      <div className="card" style={{ marginBottom: 15 }}>
        <div className="climate-grid">
          {DAYS.map((d, i) => (
            <div className={`day-col${OPT[i] ? " opt" : ""}`} key={i}>
              <div className="dn">{d}</div><div className="di" style={{ display: "grid", placeItems: "center", color: OPT[i] ? "var(--terracotta)" : "var(--umber)" }}>{weatherIcon(IC[i], { size: 26 })}</div><div className="dt">{TMP[i]}°</div><div className="dr">{RAIN[i]}mm</div>
              {OPT[i] ? <div style={{ fontSize: 9, color: "var(--terracotta)", marginTop: 6, fontWeight: 700 }}>{t("climate.optimal")}</div> : null}
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{ background: "var(--ink)", color: "var(--cream)" }}>
        <div className="panel-head"><h3 className="serif" style={{ color: "var(--cream)" }}>{t("climate.simTitle")}</h3><span style={{ color: "#b0a392" }}>{t("climate.simAside")}</span></div>
        <p style={{ fontSize: 13, color: "#cabdac", marginBottom: 18 }}>{t("climate.simIntro")}</p>
        <div className="sim-row"><label>{t("climate.simRain")} <b>{rain} mm</b></label><input type="range" min={0} max={80} value={rain} onChange={(e) => setRain(+e.target.value)} /></div>
        <div className="sim-row"><label>{t("climate.simTemp")} <b>{temp} °C</b></label><input type="range" min={4} max={28} value={temp} onChange={(e) => setTemp(+e.target.value)} /></div>
        <div className="sim-result">
          <div><div className="sim-big">{sim}%</div><div style={{ fontSize: 11, color: "#9c8f7d", textTransform: "uppercase", letterSpacing: ".5px" }}>{t("climate.simResult")}</div></div>
          <div className={`sim-delta ${delta >= 0 ? "pos" : "neg"}`}>{delta >= 0 ? "▲ +" : "▼ "}{delta} {t("climate.simVs")}</div>
        </div>
      </div>
    </div>
  );
}
