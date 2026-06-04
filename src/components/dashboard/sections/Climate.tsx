"use client";
import { useEffect, useState } from "react";
import { calcProbability } from "@/lib/model";
import type { Hotspot } from "@/data/hotspots";
import { weatherIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n";

interface Day { date: string; rain: number; temp: number; }

function iconFor(rain: number, temp: number) {
  if (rain >= 8) return "rain";
  if (rain >= 2) return "cloud";
  if (temp >= 19) return "sun";
  return "cloud-sun";
}
// día óptimo para fructificación: lluvia útil + temperatura templada
const isOptimal = (d: Day) => d.rain >= 5 && d.rain <= 35 && d.temp >= 9 && d.temp <= 18;

// Previsión de ejemplo (fallback si Open-Meteo no responde).
const MOCK: Day[] = [
  { date: "", rain: 2, temp: 13 }, { date: "", rain: 12, temp: 12 }, { date: "", rain: 18, temp: 14 },
  { date: "", rain: 4, temp: 15 }, { date: "", rain: 0, temp: 17 }, { date: "", rain: 6, temp: 16 }, { date: "", rain: 15, temp: 14 },
];

export default function Climate({ hotspots }: { hotspots: Hotspot[] }) {
  const { t, locale } = useI18n();
  const spot = hotspots[0];
  const [days, setDays] = useState<Day[]>(MOCK);
  const [live, setLive] = useState(false);

  // Clima REAL a 7 días (Open-Meteo) para el primer hotspot.
  useEffect(() => {
    if (!spot) return;
    let cancelled = false;
    fetch(`/api/forecast?lat=${spot.lat}&lng=${spot.lng}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled && Array.isArray(d.daily) && d.daily.length) { setDays(d.daily); setLive(true); } })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [spot?.lat, spot?.lng]);

  const dayName = (d: Day, i: number) => {
    if (d.date) { try { return new Date(d.date).toLocaleDateString(locale === "en" ? "en-US" : "es-ES", { weekday: "short" }); } catch { /* noop */ } }
    return t("climate.daysCsv").split(",")[i] || "";
  };

  const base = Math.round(hotspots.reduce((s, h) => s + h.prob, 0) / hotspots.length) || 60;
  const [rain, setRain] = useState(0);
  const [temp, setTemp] = useState(14);
  const sim = calcProbability({ rainMm: rain, soilTemp: temp, aspect: "N" });
  const delta = sim - base;

  return (
    <div>
      <div className="topbar"><div>
        <span className="demo-flag">{live ? t("overview.flagLive") : t("overview.flagDemo")}</span>
        <h1 className="serif">{t("climate.title")}</h1><p>{t("climate.sub")}</p>
      </div></div>
      <div className="card" style={{ marginBottom: 15 }}>
        <div className="climate-grid">
          {days.map((d, i) => (
            <div className={`day-col${isOptimal(d) ? " opt" : ""}`} key={i}>
              <div className="dn">{dayName(d, i)}</div>
              <div className="di" style={{ display: "grid", placeItems: "center", color: isOptimal(d) ? "var(--terracotta)" : "var(--umber)" }}>{weatherIcon(iconFor(d.rain, d.temp), { size: 26 })}</div>
              <div className="dt">{d.temp}°</div><div className="dr">{d.rain}mm</div>
              {isOptimal(d) ? <div style={{ fontSize: 9, color: "var(--terracotta)", marginTop: 6, fontWeight: 700 }}>{t("climate.optimal")}</div> : null}
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
