"use client";
import { useState } from "react";
import { ZONES } from "@/data/zones";
import type { Hotspot } from "@/data/hotspots";
import { useI18n, tx } from "@/lib/i18n";
import { useToast } from "../shared";
import { IconCompass } from "@/components/icons";

export default function Routes({ hotspots }: { hotspots: Hotspot[] }) {
  const { t, locale } = useI18n();
  const toast = useToast();
  const [selZone, setSelZone] = useState<string | null>(null);
  const [selSector, setSelSector] = useState<string | null>(null);
  const [km, setKm] = useState("12.4");

  const zone = ZONES.find((z) => z.id === selZone) || null;
  const top = [...hotspots].sort((a, b) => b.prob - a.prob).slice(0, 5);
  const avg = Math.round(top.reduce((s, h) => s + h.prob, 0) / top.length);

  function setSector(s: string) {
    const next = selSector === s ? null : s;
    setSelSector(next);
    toast(next ? t("toast.filterSlope", { s: t(`aspect.${s}`) }) : t("toast.showAll"));
  }
  const needleDeg = selSector ? ({ N: 0, E: 90, S: 180, O: 270 }[selSector] ?? 0) : 0;

  return (
    <div>
      <div className="topbar"><div><h1 className="serif">{t("routes.title")}</h1><p>{t("routes.sub")}</p></div><button className="btn" onClick={() => { setKm((8 + Math.random() * 8).toFixed(1)); toast(t("toast.routeRecalc")); }}>{t("routes.recalc")}</button></div>
      <div className="grid-2" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <div className="card">
          <div className="panel-head"><h3 className="serif">{t("routes.zonesTitle")}</h3><span>{zone ? zone.name : t("routes.tapZone")}</span></div>
          <div className="lomb-wrap">
            <div id="lombMap">
              <svg viewBox="0 0 1120 760">
                <defs><linearGradient id="lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9fc0c9" /><stop offset="100%" stopColor="#7ba3ae" /></linearGradient></defs>
                {ZONES.map((z) => {
                  const lit = !selSector || z.sector === selSector;
                  const col = z.prob >= 80 ? "#a86543" : z.prob >= 60 ? "#c08a5e" : z.prob >= 45 ? "#cfa988" : "#d8c4a8";
                  return <path key={z.id} className={`zone${selZone === z.id ? " sel" : ""}`} d={z.d} fill={col} fillOpacity={lit ? 0.92 : 0.3} stroke="#6d482b" strokeWidth="1" onClick={() => setSelZone(z.id)} />;
                })}
                <ellipse cx="475" cy="235" rx="22" ry="55" fill="url(#lake)" opacity=".85" transform="rotate(-18 475 235)" />
                <ellipse cx="990" cy="400" rx="18" ry="42" fill="url(#lake)" opacity=".85" transform="rotate(12 990 400)" />
                <path d="M260,120 L520,40 L640,110" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="3 4" opacity=".5" />
                {ZONES.map((z) => {
                  const lit = !selSector || z.sector === selSector;
                  return (
                    <g key={z.id + "d"} className="zone-dot" onClick={() => setSelZone(z.id)} opacity={lit ? 1 : 0.35}>
                      <circle cx={z.cx} cy={z.cy} r={6 + z.prob / 14} fill="#faf5ec" stroke="#6d482b" strokeWidth="1.5" />
                      <text x={z.cx} y={z.cy + 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="#6d482b">{z.prob}</text>
                    </g>
                  );
                })}
                {ZONES.map((z) => <text key={z.id + "t"} x={z.cx} y={z.cy - 18} textAnchor="middle" fontSize="13" fontFamily="Fraunces,serif" fontStyle="italic" fill="#2e231b" opacity={(!selSector || z.sector === selSector) ? 0.85 : 0.3}>{z.name}</text>)}
              </svg>
              <div className="compass">
                <div className="compass-ring">
                  <span className="cdir n" onClick={() => setSector("N")}>N</span>
                  <span className="cdir e" onClick={() => setSector("E")}>E</span>
                  <span className="cdir s" onClick={() => setSector("S")}>S</span>
                  <span className="cdir w" onClick={() => setSector("O")}>{locale === "en" ? "W" : "O"}</span>
                  <div className="needle" style={{ transform: `translate(-50%,-100%) rotate(${needleDeg}deg)` }} />
                  <div className="compass-c" />
                </div>
                <div className="compass-lbl">{selSector ? t("routes.slopesOf", { s: t(`aspect.${selSector}`) }) : t("routes.allSlopes")}</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="card" style={{ marginBottom: 15 }}>
            {zone ? (
              <>
                <div className="zp-head"><h4>{zone.name}</h4><div className="zp-prob">{zone.prob}%</div></div>
                <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 14 }}>{tx(zone.hab, locale)}</div>
                <div className="zp-stats">
                  <div className="zp-stat"><div className="zl">{t("routes.altitude")}</div><div className="zv">{zone.alt}</div></div>
                  <div className="zp-stat"><div className="zl">{t("routes.hotspots")}</div><div className="zv">{zone.spots} {t("routes.active")}</div></div>
                  <div className="zp-stat"><div className="zl">{t("routes.lastRain")}</div><div className="zv">{zone.rain}</div></div>
                  <div className="zp-stat"><div className="zl">{t("routes.slope")}</div><div className="zv">{t(`aspect.${zone.sector}`)}</div></div>
                </div>
                <div style={{ marginTop: 12, fontSize: 12, color: "var(--ink-soft)" }}><b>{t("routes.typicalSp")}</b> {tx(zone.sp, locale)}</div>
              </>
            ) : (
              <div className="zone-panel-empty"><div className="zpe-ic" style={{ display: "grid", placeItems: "center", color: "var(--sand)" }}><IconCompass size={34} /></div><div style={{ fontSize: 13 }}>{t("routes.empty")}</div></div>
            )}
          </div>
          <div className="card">
            <div className="panel-head"><h3 className="serif">{t("routes.routeTitle")}</h3></div>
            <div>
              {top.map((h, i) => (
                <div className="route-stop-item" key={i}><div className="route-num">{i + 1}</div><div><div className="rt">{h.name}</div><div className="rs">{h.species} · {h.alt} m</div></div><div className="rp">{h.prob}%</div></div>
              ))}
            </div>
            <div className="route-info" style={{ marginTop: 16 }}>
              <div className="route-stat"><div className="rv">{top.length}</div><div className="rl">{t("routes.stops")}</div></div>
              <div className="route-stat"><div className="rv">{km} km</div><div className="rl">{t("routes.distance")}</div></div>
              <div className="route-stat"><div className="rv">{avg}%</div><div className="rl">{t("routes.avgProb")}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
