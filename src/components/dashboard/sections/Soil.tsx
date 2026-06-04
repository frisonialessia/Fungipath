"use client";
import { useEffect, useState } from "react";
import { MYCORRHIZA } from "@/data/zones";
import type { Hotspot } from "@/data/hotspots";
import { treeIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n";

interface Soil { ph?: number; clay?: number; sand?: number; silt?: number; soc?: number; moisture?: number; elevation?: number; slope?: number; aspect?: string; }

export default function Soil({ hotspots }: { hotspots: Hotspot[] }) {
  const { t, locale } = useI18n();
  const spot = hotspots[0];
  const [d, setD] = useState<Soil>({});
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!spot) return;
    let cancelled = false;
    fetch(`/api/soil?lat=${spot.lat}&lng=${spot.lng}`)
      .then((r) => r.json())
      .then((res) => { if (cancelled) return; if (res && (res.ph != null || res.elevation != null || res.moisture != null)) { setD(res); setLive(true); } })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [spot?.lat, spot?.lng]);

  // valores reales o fallback mock
  const ph = d.ph ?? 5.4;
  const clay = d.clay ?? 22, sand = d.sand ?? 38, silt = d.silt ?? 40;
  const soc = d.soc ?? 3.2;
  const moisture = d.moisture ?? 78;
  const elevation = d.elevation ?? spot?.alt ?? 800;
  const slope = d.slope ?? 12;
  const aspect = d.aspect ?? spot?.aspect ?? "N";

  const phClass = ph < 5.6 ? "acidic" : ph <= 7.0 ? "neutral" : "alkaline";
  const aspectLabel = aspect === "flat" ? t("soil.flat") : t(`aspect.${aspect}`);
  const bestBets = ph < 5.6 ? "Boletus edulis, Cantharellus, Lactarius" : ph <= 7.0 ? "Amanita caesarea, Agaricus, Macrolepiota" : "Tuber melanosporum, Calocybe gambosa";

  return (
    <div>
      <div className="topbar"><div>
        <span className="demo-flag">{live ? t("overview.flagLive") : t("overview.flagDemo")}</span>
        <h1 className="serif">{t("soil.title")}</h1><p>{t("soil.sub")}{spot ? ` · ${t("soil.forLoc", { name: spot.name })}` : ""}</p>
      </div></div>

      {/* Suelo real */}
      <div className="grid-3" style={{ marginBottom: 15 }}>
        <div className="card"><div className="k-label">{t("soil.ph")}</div><div className="k-value">{ph}</div><span className="chip up">{t(`soil.${phClass}`)}{phClass === "acidic" ? " · " + t("soil.favorable") : ""}</span></div>
        <div className="card"><div className="k-label">{t("soil.moisture")}</div><div className="k-value">{moisture}<span className="u">%</span></div><span className="chip up">{moisture >= 60 ? "óptima" : "—"}</span></div>
        <div className="card"><div className="k-label">{t("soil.organicC")}</div><div className="k-value">{soc}<span className="u"> g/kg</span></div><span className="chip up">{soc >= 2 ? "rico" : "pobre"}</span></div>
      </div>

      {/* Textura + Terreno */}
      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="card">
          <div className="panel-head"><h3 className="serif">{t("soil.texture")}</h3><span>0–5 cm</span></div>
          <div style={{ display: "flex", height: 22, borderRadius: 8, overflow: "hidden", border: "1px solid var(--line)" }}>
            <div style={{ width: `${clay}%`, background: "var(--terracotta)" }} title="clay" />
            <div style={{ width: `${sand}%`, background: "var(--sand)" }} title="sand" />
            <div style={{ width: `${silt}%`, background: "var(--cream-2)" }} title="silt" />
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 12 }}>
            <span><b style={{ color: "var(--terracotta)" }}>{clay}%</b> {t("soil.clay")}</span>
            <span><b style={{ color: "var(--umber)" }}>{sand}%</b> {t("soil.sand")}</span>
            <span><b style={{ color: "var(--stone)" }}>{silt}%</b> {t("soil.silt")}</span>
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--sand)" }}>
            <div className="panel-head" style={{ marginBottom: 6 }}><h3 className="serif" style={{ fontSize: 16 }}>{t("soil.bestBets")}</h3></div>
            <div style={{ fontSize: 12.5, color: "var(--stone)", marginBottom: 6 }}>{t("soil.bestBetsSub")}</div>
            <div style={{ fontStyle: "italic", fontSize: 14, color: "var(--ink)" }}>{bestBets}</div>
          </div>
        </div>

        <div className="card">
          <div className="panel-head"><h3 className="serif">{t("soil.terrain")}</h3><span>DEM · Open-Meteo</span></div>
          <div className="route-info" style={{ gap: 28 }}>
            <div className="route-stat"><div className="rv">{elevation}<span style={{ fontSize: 14 }}> m</span></div><div className="rl">{t("soil.elevation")}</div></div>
            <div className="route-stat"><div className="rv">{slope}<span style={{ fontSize: 14 }}>°</span></div><div className="rl">{t("soil.slope")}</div></div>
            <div className="route-stat"><div className="rv">{aspectLabel}</div><div className="rl">{t("soil.aspectL")}</div></div>
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--sand)" }}>
            <div className="panel-head" style={{ marginBottom: 10 }}><h3 className="serif" style={{ fontSize: 16 }}>{t("soil.mycoTitle")}</h3><span>{t("soil.mycoAside")}</span></div>
            {MYCORRHIZA.map((m, i) => (
              <div className="myco-row" key={i}><div className="myco-tree" style={{ color: "var(--moss)" }}>{treeIcon(m[0], { size: 22 })}</div><div><div className="mt">{t(`soil.trees.${m[0]}`)}</div></div><span className="myco-arrow">→</span><div className="ms">{m[1]}</div></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
