"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { Hotspot, DiaryEntry } from "@/data/hotspots";
import { type Parcel, areaHa } from "@/data/parcels";
import { REGIONS } from "@/data/zones";
import { SPECIES } from "@/lib/species";
import { mushIcon } from "@/lib/illustrations";
import { useI18n, tx } from "@/lib/i18n";
import { Illu, useToast } from "../shared";
import GbifBadge from "../GbifBadge";
import { IconPin, IconParcel } from "@/components/icons";
import type { MapHotspot, MapParcel } from "@/components/FungiMap";

const FungiMap = dynamic(() => import("@/components/FungiMap"), { ssr: false });
export default function Overview({
  hotspots, selectedIdx, setSelectedIdx, diary, onNewHotspot, onAskGuide, onMapCreate, predicting, live, source,
  parcels = [], mapMode = "pin", setMapMode, onParcelComplete, selectedParcelId, onSelectParcel,
}: {
  hotspots: Hotspot[]; selectedIdx: number; setSelectedIdx: (i: number) => void; diary: DiaryEntry[];
  onNewHotspot: () => void; onAskGuide: () => void; onMapCreate?: (lat: number, lng: number) => void;
  predicting?: boolean; live?: boolean; source?: "db" | "mock";
  parcels?: Parcel[]; mapMode?: "pin" | "parcel"; setMapMode?: (m: "pin" | "parcel") => void;
  onParcelComplete?: (pts: [number, number][]) => void; selectedParcelId?: string | null; onSelectParcel?: (id: string) => void;
}) {
  const { t, locale } = useI18n();
  const toast = useToast();
  const [filter, setFilter] = useState("all");
  const [region, setRegion] = useState(REGIONS[0]);

  const filterOptions = useMemo(() => ["all", ...Array.from(new Set(hotspots.map((h) => h.species.split(" ")[0])))], [hotspots]);
  const visible = useMemo(() => (filter === "all" ? hotspots : hotspots.filter((h) => h.species.split(" ")[0] === filter)), [filter, hotspots]);
  const sel = hotspots[selectedIdx] ?? hotspots[0];
  const avg = Math.round(hotspots.reduce((s, h) => s + h.prob, 0) / hotspots.length);
  const top = [...hotspots].sort((a, b) => b.prob - a.prob)[0];
  const opening = hotspots.filter((h) => h.prob >= 70).length;
  const top3 = [...hotspots].sort((a, b) => b.prob - a.prob).slice(0, 3);
  const heroStatus = (h: Hotspot) => {
    const w = h.windowDays;
    if (typeof w !== "number") return t("overview.heroWatch");
    return w <= 0 ? t("overview.heroOpen") : t("overview.heroSoon", { w });
  };

  const windowDays = sel?.windowDays ?? 4;
  const daysSinceRain = sel?.daysSinceRain ?? 9;
  const CIRC = 226;
  const progress = Math.max(0, Math.min(1, (13 - windowDays) / 13));
  const dashOffset = CIRC * (1 - progress);
  const windows = hotspots.map((h) => h.windowDays).filter((w): w is number => typeof w === "number");
  const soonest = windows.length ? Math.min(...windows) : 3;

  const mapPoints: MapHotspot[] = visible.map((h) => ({ id: String(hotspots.indexOf(h)), name: h.name, species: h.species, prob: h.prob, lat: h.lat, lng: h.lng, alt: h.alt }));
  const mapParcels: MapParcel[] = parcels.map((p) => ({ id: p.id, name: p.name, prob: p.prob, points: p.points }));
  const selParcel = parcels.find((p) => p.id === selectedParcelId) || null;

  const base = [42, 40, 38, 44, 52, 49, 55, 61, 58, 66, 72, 68, 82, 91];
  const W = 260, H = 60, MAX = 100;
  const pts = base.map((v, i) => [12 + i * (W - 24) / (base.length - 1), H - 6 - (v / MAX) * (H - 14)]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + ` L${pts[pts.length - 1][0].toFixed(1)} ${H} L${pts[0][0].toFixed(1)} ${H} Z`;

  const factorLabel = (k: string) => t(`factor.${k}`);
  const factorValue = (k: string, v: string) => (k === "aspect" ? t(`aspect.${v}`) : v);
  const flag = (predicting ? t("overview.flagCalc") : live ? t("overview.flagLive") : t("overview.flagDemo")) + (source === "db" ? " · Supabase" : "");

  return (
    <div>
      {/* Hero inmersivo · bosque real + parcelas brillantes + tus 3 mejores hotspots (datos reales) */}
      <section className="dash-hero">
        <div className="dh-scrim" />
        <svg className="dh-poly" viewBox="0 0 1000 340" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <defs>
            <filter id="dhglow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <linearGradient id="dhfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#52ac4d" stopOpacity=".30" /><stop offset="100%" stopColor="#52ac4d" stopOpacity=".05" /></linearGradient>
          </defs>
          <g filter="url(#dhglow)" fill="url(#dhfill)" stroke="#73c57a" strokeWidth="2" strokeLinejoin="round">
            <polygon className="poly p1" points="470,70 660,50 720,180 560,250 440,180" />
            <polygon className="poly p2" points="700,150 900,120 960,290 770,320 690,230" />
            <polygon className="poly p3" points="540,210 700,250 660,330 500,320" />
          </g>
        </svg>
        <div className="dh-inner">
          <div className="dh-copy">
            <span className="dh-flag">{flag}</span>
            <h1>{t("overview.greeting")}</h1>
            <p className="dh-sub">{t("overview.subtitle", { n: opening })}</p>
            <p className="dh-insight">{t("overview.insightBody", { name: top.name, prob: top.prob, sp: top.species.split(" ")[0], opening })}</p>
            <div className="dh-actions">
              <button className="btn-hero" onClick={onNewHotspot}>{t("overview.newHotspot")}</button>
              <button className="btn-hero ghost" onClick={onAskGuide}>{t("overview.askGuide")}</button>
            </div>
          </div>
          <div className="dh-cards">
            {top3.map((h, k) => (
              <button key={k} className={`dh-card${k === 0 ? " hi" : ""}`} onClick={() => setSelectedIdx(hotspots.indexOf(h))}>
                <div className="v">{h.prob}%</div>
                <div className="meta"><div className="nm">{h.name}</div><div className="st">{heroStatus(h)}</div></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="pills">
        {filterOptions.map((s) => (
          <button key={s} className={`pill${filter === s ? " on" : ""}`} onClick={() => { setFilter(s); toast(s === "all" ? t("toast.filterAll") : t("toast.filter", { s })); }}>
            {s === "all" ? t("overview.allSpecies") : s}
          </button>
        ))}
      </div>

      <div className="metrics">
        <div className="card reveal"><div className="k-label">{t("overview.mActive")}</div><div className="k-value">{hotspots.length}</div><span className="chip up">{t("overview.chipWeek")}</span></div>
        <div className="card reveal"><div className="k-label">{t("overview.mAvg")}</div><div className="k-value">{avg}<span className="u">%</span></div><span className="chip up">{t("overview.chipPts")}</span></div>
        <div className="card reveal"><div className="k-label">{t("overview.mWindow")}</div><div className="k-value">{soonest}<span className="u"> {locale === "en" ? "days" : "días"}</span></div><span className="chip warn">{soonest <= 0 ? t("overview.windowOpen") : t("overview.windowSoon")}</span></div>
        <div className="card reveal"><div className="k-label">{t("overview.mHumidity")}</div><div className="k-value">82<span className="u">%</span></div><span className="chip up">{t("overview.humidityOpt")}</span></div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="panel-head">
            <h3 className="serif">{t("overview.mapTitle")}</h3>
            <select className="select-mini" value={region.id} onChange={(e) => { const r = REGIONS.find((x) => x.id === e.target.value)!; setRegion(r); toast(t("toast.region", { r: tx(r.label, locale) })); }}>
              {REGIONS.map((r) => <option key={r.id} value={r.id}>{tx(r.label, locale)}</option>)}
            </select>
          </div>
          <div className="map">
            <div className="map-toolbar">
              <button className={mapMode === "pin" ? "on" : ""} onClick={() => setMapMode?.("pin")}><IconPin size={13} />{t("overview.modePin")}</button>
              <button className={mapMode === "parcel" ? "on" : ""} onClick={() => setMapMode?.("parcel")}><IconParcel size={13} />{t("overview.modeParcel")}</button>
            </div>
            <div className="map-hint">{mapMode === "parcel" ? t("overview.drawHint") : t("overview.mapHint")}</div>
            <div className="map-legend"><span className="lg-dot" />{t("overview.legend")}</div>
            <FungiMap hotspots={mapPoints} parcels={mapParcels} center={region.center} zoom={region.zoom}
              onSelect={(id) => setSelectedIdx(Number(id))} onMapClick={onMapCreate}
              drawMode={mapMode === "parcel"} onParcelComplete={onParcelComplete} onSelectParcel={onSelectParcel} />
          </div>
          {selParcel ? (
            <div className="explain">
              <div className="top">
                <div><div className="sp">{selParcel.species}</div><div className="hb">{t("overview.selParcel")} · {selParcel.name} · {areaHa(selParcel.points)} ha</div></div>
                <div className="big">{selParcel.prob || "…"}{selParcel.prob ? "%" : ""}</div>
              </div>
              <div className="why"><b>{t("overview.why")}</b> {selParcel.why}</div>
              {selParcel.notes && <div className="factors"><div className="factor" style={{ flex: 1 }}><div className="fl">{t("overview.parcelNotes")}</div><div className="fv">{selParcel.notes}</div></div></div>}
              <GbifBadge species={selParcel.species} lat={selParcel.lat} lng={selParcel.lng} radius={25} />
            </div>
          ) : sel && (
            <div className="explain">
              <div className="top">
                <div><div className="sp">{sel.species}</div><div className="hb">{sel.habitat} · {sel.alt} m · {t("factor.aspect").toLowerCase()} {t(`aspect.${sel.aspect}`)}</div></div>
                <div className="big">{sel.prob}%</div>
              </div>
              <div className="why"><b>{t("overview.why")}</b> {sel.why}</div>
              <div className="factors">{sel.factors.map((f, i) => <div className="factor" key={i}><div className="fl">{factorLabel(f[0])}</div><div className="fv">{factorValue(f[0], f[1])}</div></div>)}</div>
              <GbifBadge species={sel.species} lat={sel.lat} lng={sel.lng} radius={25} />
            </div>
          )}
        </div>

        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="panel-head"><h3 className="serif">{t("overview.yourHotspots")}</h3><span>{t("overview.sites", { n: visible.length })}</span></div>
          <div style={{ flex: 1, overflowY: "auto", maxHeight: 560, marginRight: -6, paddingRight: 6 }}>
            {visible.map((h) => {
              const i = hotspots.indexOf(h);
              const c = SPECIES.find((s) => s.n.includes(h.species.split(" ")[0]))?.cap || "#318c6f";
              return (
                <div key={i} className={`row${i === selectedIdx ? " sel" : ""}`} onClick={() => setSelectedIdx(i)}>
                  <Illu className="badge" html={mushIcon(h.species, SPECIES, c)} />
                  <div><div className="t">{h.name}</div><div className="s">{h.species} · {h.alt} m</div></div>
                  <div className="prob"><div className="p">{h.prob}%</div><div className="bar"><i style={{ width: `${h.prob}%` }} /></div></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="card">
          <div className="panel-head"><h3 className="serif">{t("overview.clockTitle")}</h3></div>
          <div className="clock-wrap">
            <div className="clock">
              <svg width="84" height="84"><circle cx="42" cy="42" r="36" fill="none" stroke="#e4ddd0" strokeWidth="8" /><circle cx="42" cy="42" r="36" fill="none" stroke="#318c6f" strokeWidth="8" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={dashOffset} /></svg>
              <div className="cv">{windowDays <= 0 ? (locale === "en" ? "Now" : "Ya") : `~${windowDays}d`}</div>
            </div>
            <div className="clock-info"><h4>{sel?.name}</h4><p>{t("overview.clockBodyDays", { d: daysSinceRain })} {windowDays <= 0 ? t("overview.clockOpen") : t("overview.clockSoon", { w: windowDays })}</p></div>
          </div>
        </div>

        <div className="card">
          <div className="panel-head"><h3 className="serif">{t("overview.trendTitle")}</h3></div>
          <svg viewBox="0 0 260 60" style={{ width: "100%", height: 88 }}>
            <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#318c6f" stopOpacity=".3" /><stop offset="100%" stopColor="#318c6f" stopOpacity="0" /></linearGradient></defs>
            <path d={area} fill="url(#tg)" /><path d={line} fill="none" stroke="#318c6f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={pts[pts.length - 1][0].toFixed(1)} cy={pts[pts.length - 1][1].toFixed(1)} r="3.5" fill="#318c6f" />
          </svg>
        </div>
      </div>
    </div>
  );
}
