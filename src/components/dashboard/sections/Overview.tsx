"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { Hotspot, DiaryEntry } from "@/data/hotspots";
import { REGIONS } from "@/data/zones";
import { SPECIES } from "@/lib/species";
import { mushIcon } from "@/lib/illustrations";
import { useI18n, tx } from "@/lib/i18n";
import { Illu, useToast } from "../shared";
import { INSIGHT_ICON } from "../icons";
import GbifBadge from "../GbifBadge";
import { IconPin } from "@/components/icons";
import type { MapHotspot } from "@/components/FungiMap";

const FungiMap = dynamic(() => import("@/components/FungiMap"), { ssr: false });
const PILLS = ["all", "Boletus edulis", "Cantharellus", "Lactarius"];

export default function Overview({
  hotspots, selectedIdx, setSelectedIdx, diary, onNewHotspot, onAskGuide, onMapCreate, predicting, live,
}: {
  hotspots: Hotspot[]; selectedIdx: number; setSelectedIdx: (i: number) => void; diary: DiaryEntry[];
  onNewHotspot: () => void; onAskGuide: () => void; onMapCreate?: (lat: number, lng: number) => void;
  predicting?: boolean; live?: boolean;
}) {
  const { t, locale } = useI18n();
  const toast = useToast();
  const [filter, setFilter] = useState("all");
  const [region, setRegion] = useState(REGIONS[0]);

  const visible = useMemo(() => (filter === "all" ? hotspots : hotspots.filter((h) => h.species.includes(filter))), [filter, hotspots]);
  const sel = hotspots[selectedIdx] ?? hotspots[0];
  const avg = Math.round(hotspots.reduce((s, h) => s + h.prob, 0) / hotspots.length);
  const top = [...hotspots].sort((a, b) => b.prob - a.prob)[0];
  const opening = hotspots.filter((h) => h.prob >= 70).length;

  const windowDays = sel?.windowDays ?? 4;
  const daysSinceRain = sel?.daysSinceRain ?? 9;
  const CIRC = 226;
  const progress = Math.max(0, Math.min(1, (13 - windowDays) / 13));
  const dashOffset = CIRC * (1 - progress);
  const windows = hotspots.map((h) => h.windowDays).filter((w): w is number => typeof w === "number");
  const soonest = windows.length ? Math.min(...windows) : 3;

  const mapPoints: MapHotspot[] = visible.map((h) => ({ id: String(hotspots.indexOf(h)), name: h.name, species: h.species, prob: h.prob, lat: h.lat, lng: h.lng, alt: h.alt }));

  const base = [42, 40, 38, 44, 52, 49, 55, 61, 58, 66, 72, 68, 82, 91];
  const W = 260, H = 60, MAX = 100;
  const pts = base.map((v, i) => [12 + i * (W - 24) / (base.length - 1), H - 6 - (v / MAX) * (H - 14)]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + ` L${pts[pts.length - 1][0].toFixed(1)} ${H} L${pts[0][0].toFixed(1)} ${H} Z`;

  const factorLabel = (k: string) => t(`factor.${k}`);
  const factorValue = (k: string, v: string) => (k === "aspect" ? t(`aspect.${v}`) : v);
  const flag = predicting ? t("overview.flagCalc") : live ? t("overview.flagLive") : t("overview.flagDemo");

  return (
    <div>
      <div className="topbar">
        <div>
          <span className="demo-flag">{flag}</span>
          <h1 className="serif">{t("overview.greeting")}</h1>
          <p>{t("overview.subtitle", { n: opening })}</p>
        </div>
        <button className="btn" onClick={onNewHotspot}>{t("overview.newHotspot")}</button>
      </div>

      <div className="pills">
        {PILLS.map((s) => (
          <button key={s} className={`pill${filter === s ? " on" : ""}`} onClick={() => { setFilter(s); toast(s === "all" ? t("toast.filterAll") : t("toast.filter", { s })); }}>
            {s === "all" ? t("overview.allSpecies") : s}
          </button>
        ))}
      </div>

      <div className="insight" onClick={onAskGuide}>
        <div className="ins-ic">{INSIGHT_ICON}</div>
        <div className="ins-txt"><b>{t("overview.insightPrefix")}</b> {t("overview.insightBody", { name: top.name, prob: top.prob, sp: top.species.split(" ")[0], opening })}</div>
        <div className="ins-cta">{t("overview.askGuide")}</div>
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
            <div className="map-hint"><IconPin size={13} />{t("overview.mapHint")}</div>
            <div className="map-legend"><span className="lg-dot" />{t("overview.legend")}</div>
            <FungiMap hotspots={mapPoints} center={region.center} zoom={region.zoom} onSelect={(id) => setSelectedIdx(Number(id))} onMapClick={onMapCreate} />
          </div>
          {sel && (
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

        <div className="card">
          <div className="panel-head"><h3 className="serif">{t("overview.yourHotspots")}</h3><span>{t("overview.sites", { n: visible.length })}</span></div>
          <div>
            {visible.map((h) => {
              const i = hotspots.indexOf(h);
              const c = SPECIES.find((s) => s.n.includes(h.species.split(" ")[0]))?.cap || "#a86543";
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

      <div className="grid-3">
        <div className="card">
          <div className="panel-head"><h3 className="serif">{t("overview.clockTitle")}</h3></div>
          <div className="clock-wrap">
            <div className="clock">
              <svg width="84" height="84"><circle cx="42" cy="42" r="36" fill="none" stroke="#d6c4ac" strokeWidth="8" /><circle cx="42" cy="42" r="36" fill="none" stroke="#a86543" strokeWidth="8" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={dashOffset} /></svg>
              <div className="cv">{windowDays <= 0 ? (locale === "en" ? "Now" : "Ya") : `~${windowDays}d`}</div>
            </div>
            <div className="clock-info"><h4>{sel?.name}</h4><p>{t("overview.clockBodyDays", { d: daysSinceRain })} {windowDays <= 0 ? t("overview.clockOpen") : t("overview.clockSoon", { w: windowDays })}</p></div>
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--sand)" }}>
            <div style={{ fontSize: 11, color: "var(--stone)", textTransform: "uppercase", letterSpacing: ".5px", fontWeight: 600, marginBottom: 8 }}>{t("overview.trendTitle")}</div>
            <svg viewBox="0 0 260 60" style={{ width: "100%", height: 54 }}>
              <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a86543" stopOpacity=".3" /><stop offset="100%" stopColor="#a86543" stopOpacity="0" /></linearGradient></defs>
              <path d={area} fill="url(#tg)" /><path d={line} fill="none" stroke="#a86543" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={pts[pts.length - 1][0].toFixed(1)} cy={pts[pts.length - 1][1].toFixed(1)} r="3.5" fill="#8b3f29" />
            </svg>
          </div>
        </div>

        <div className="card">
          <div className="panel-head"><h3 className="serif">{t("overview.diaryTitle")}</h3><span>{t("overview.learns")}</span></div>
          <div>
            {diary.slice(0, 4).map((l, i) => (
              <div className="log-item" key={i}><span className={`log-dot ${l.found ? "ok" : "no"}`} /><span className="lt">{l.spot}</span><span className="lq">{l.found ? t("overview.diaryHit", { q: l.qty }) : t("overview.diaryEmpty")}</span></div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="panel-head"><h3 className="serif">{t("overview.privacyTitle")}</h3><span>{t("overview.yourSites")}</span></div>
          {hotspots.slice(0, 2).map((h, i) => (
            <div className="priv-row" key={i}><div className="pn">{h.name}</div><span className={`priv-tag ${h.priv}`}>{t(`privacy.${h.priv}`)}</span></div>
          ))}
          <div className="priv-row"><div className="pn">{t("overview.windowAlerts")}</div><span className="priv-tag shared">{t("overview.on")}</span></div>
        </div>
      </div>
    </div>
  );
}
