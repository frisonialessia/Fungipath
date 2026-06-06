"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { FORAGING } from "@/data/foraging";
import { SPECIES } from "@/lib/species";
import { useI18n, tx } from "@/lib/i18n";
import { Illu, useToast } from "../shared";
import GbifBadge from "../GbifBadge";
import { mushIcon } from "@/lib/illustrations";
import type { MapHotspot } from "@/components/FungiMap";

const FungiMap = dynamic(() => import("@/components/FungiMap"), { ssr: false });

// vista inicial: Europa con detalle, pero se puede alejar a todo el mundo
const DEFAULT_VIEW = { center: [46, 7] as [number, number], zoom: 5 };

export default function Routes() {
  const { t, locale } = useI18n();
  const toast = useToast();
  const [probs, setProbs] = useState<Record<string, number>>({});
  const [predicting, setPredicting] = useState(true);
  const [selId, setSelId] = useState<string | null>(null);
  const [view, setView] = useState(DEFAULT_VIEW);

  // Probabilidad EN VIVO (Open-Meteo) para cada región del mundo.
  useEffect(() => {
    let cancelled = false;
    setPredicting(true);
    (async () => {
      try {
        const r = await fetch("/api/predict/batch", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang: locale, points: FORAGING.map((f) => ({ lat: f.lat, lng: f.lng, aspect: f.aspect, species: f.species })) }),
        });
        const data = await r.json();
        if (cancelled || !Array.isArray(data.results)) { setPredicting(false); return; }
        const map: Record<string, number> = {};
        FORAGING.forEach((f, i) => { if (data.results[i]) map[f.id] = data.results[i].probability; });
        setProbs(map);
      } catch { /* sin red: prob queda vacía */ }
      finally { if (!cancelled) setPredicting(false); }
    })();
    return () => { cancelled = true; };
  }, [locale]);

  const spots: MapHotspot[] = useMemo(() => FORAGING.map((f) => ({
    id: f.id, name: f.name, species: f.species, prob: probs[f.id] ?? 0, lat: f.lat, lng: f.lng,
  })), [probs]);

  const sel = FORAGING.find((f) => f.id === selId) || null;
  const ranked = [...FORAGING].map((f) => ({ f, prob: probs[f.id] ?? 0 })).sort((a, b) => b.prob - a.prob);
  const avg = ranked.length ? Math.round(ranked.reduce((s, x) => s + x.prob, 0) / ranked.length) : 0;

  // brújula: centro recentra; flechas desplazan el mapa
  function recenter() { setView({ ...DEFAULT_VIEW }); toast(t("routes.recenter")); }
  function pan(dir: "N" | "S" | "E" | "O") {
    const span = 360 / Math.pow(2, view.zoom) * 0.5;
    setView((v) => {
      const [lat, lng] = v.center;
      const c: [number, number] = dir === "N" ? [Math.min(82, lat + span), lng] : dir === "S" ? [Math.max(-82, lat - span), lng] : dir === "E" ? [lat, lng + span] : [lat, lng - span];
      return { center: c, zoom: v.zoom };
    });
  }

  return (
    <div>
      <div className="topbar">
        <div>
          <span className="demo-flag">{predicting ? t("routes.calcWorld") : t("overview.flagLive")}</span>
          <h1 className="serif">{t("routes.worldTitle")}</h1>
          <p>{t("routes.worldSub")}</p>
        </div>
      </div>
      <div className="grid-2" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <div className="card">
          <div className="panel-head"><h3 className="serif">{t("routes.worldTitle")}</h3><span>{FORAGING.length} {t("nav.routes").toLowerCase()}</span></div>
          <div className="map" style={{ height: 420 }}>
            <FungiMap hotspots={spots} center={view.center} zoom={view.zoom} onSelect={(id) => setSelId(id)} />
            <div className="compass" title={t("routes.recenter")}>
              <div className="compass-ring">
                <span className="cdir n" onClick={() => pan("N")}>N</span>
                <span className="cdir e" onClick={() => pan("E")}>E</span>
                <span className="cdir s" onClick={() => pan("S")}>S</span>
                <span className="cdir w" onClick={() => pan("O")}>{locale === "en" ? "W" : "O"}</span>
                <div className="needle" />
                <button className="compass-c" onClick={recenter} aria-label={t("routes.recenter")} />
              </div>
              <div className="compass-lbl">{t("routes.recenter")}</div>
            </div>
          </div>
        </div>
        <div>
          <div className="card" style={{ marginBottom: 15 }}>
            {sel ? (
              <>
                <div className="zp-head"><h4>{sel.name}</h4><div className="zp-prob">{(probs[sel.id] ?? 0) || "…"}{probs[sel.id] ? "%" : ""}</div></div>
                <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 14 }}>{sel.country}</div>
                <div className="zp-stats">
                  <div className="zp-stat"><div className="zl">{t("routes.star")}</div><div className="zv" style={{ fontStyle: "italic" }}>{sel.species}</div></div>
                  <div className="zp-stat"><div className="zl">{t("species.season")}</div><div className="zv">{tx(sel.season, locale)}</div></div>
                </div>
                <div style={{ marginTop: 12, fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>{tx(sel.note, locale)}</div>
                <GbifBadge species={sel.species} lat={sel.lat} lng={sel.lng} radius={50} variant="line" />
              </>
            ) : (
              <div className="zone-panel-empty"><div className="zpe-ic">🌍</div><div style={{ fontSize: 13 }}>{t("routes.tapSpot")}</div></div>
            )}
          </div>
          <div className="card">
            <div className="panel-head"><h3 className="serif">{t("routes.best")}</h3><span>{avg ? `${avg}% ${t("routes.avgProb")}` : ""}</span></div>
            <div>
              {ranked.slice(0, 6).map(({ f, prob }, i) => {
                const c = SPECIES.find((s) => s.n.includes(f.species.split(" ")[0]))?.cap || "#ffa143";
                return (
                  <div className="route-stop-item" key={f.id} style={{ cursor: "pointer" }} onClick={() => { setSelId(f.id); setView({ center: [f.lat, f.lng], zoom: 6 }); }}>
                    <div className="route-num">{i + 1}</div>
                    <Illu style={{ width: 30, height: 30, display: "grid", placeItems: "center" }} html={mushIcon(f.species, SPECIES, c)} />
                    <div><div className="rt">{f.name}</div><div className="rs">{f.country} · {f.species}</div></div>
                    <div className="rp">{prob || "…"}{prob ? "%" : ""}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
