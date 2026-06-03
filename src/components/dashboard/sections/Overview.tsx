"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { Hotspot } from "@/data/hotspots";
import type { DiaryEntry } from "@/data/hotspots";
import { REGIONS } from "@/data/zones";
import { SPECIES } from "@/lib/species";
import { mushIcon } from "@/lib/illustrations";
import { Illu, useToast } from "../shared";
import { INSIGHT_ICON } from "../icons";
import GbifBadge from "../GbifBadge";
import type { MapHotspot } from "@/components/FungiMap";

const FungiMap = dynamic(() => import("@/components/FungiMap"), { ssr: false });

const PILLS = ["all", "Boletus edulis", "Cantharellus", "Lactarius"];

export default function Overview({
  hotspots, selectedIdx, setSelectedIdx, diary, onNewHotspot, onAskGuide, predicting, live,
}: {
  hotspots: Hotspot[];
  selectedIdx: number;
  setSelectedIdx: (i: number) => void;
  diary: DiaryEntry[];
  onNewHotspot: () => void;
  onAskGuide: () => void;
  predicting?: boolean;
  live?: boolean;
}) {
  const toast = useToast();
  const [filter, setFilter] = useState("all");
  const [region, setRegion] = useState(REGIONS[0]);

  const visible = useMemo(
    () => (filter === "all" ? hotspots : hotspots.filter((h) => h.species.includes(filter))),
    [filter, hotspots]
  );

  const sel = hotspots[selectedIdx] ?? hotspots[0];
  const avg = Math.round(hotspots.reduce((s, h) => s + h.prob, 0) / hotspots.length);
  const top = [...hotspots].sort((a, b) => b.prob - a.prob)[0];
  const opening = hotspots.filter((h) => h.prob >= 70).length;

  // Reloj de fructificación con datos reales (Open-Meteo) si están disponibles.
  const windowDays = sel?.windowDays ?? 4;
  const daysSinceRain = sel?.daysSinceRain ?? 9;
  const CIRC = 226; // 2·π·36
  const progress = Math.max(0, Math.min(1, (13 - windowDays) / 13));
  const dashOffset = CIRC * (1 - progress);
  // ventana más próxima entre los hotspots con datos en vivo
  const windows = hotspots.map((h) => h.windowDays).filter((w): w is number => typeof w === "number");
  const soonest = windows.length ? Math.min(...windows) : 3;

  const mapPoints: MapHotspot[] = visible.map((h) => ({
    id: String(hotspots.indexOf(h)), name: h.name, species: h.species, prob: h.prob, lat: h.lat, lng: h.lng, alt: h.alt,
  }));

  // tendencia 14 días (demo ascendente)
  const base = [42, 40, 38, 44, 52, 49, 55, 61, 58, 66, 72, 68, 82, 91];
  const W = 260, H = 60, MAX = 100;
  const pts = base.map((v, i) => [12 + i * (W - 24) / (base.length - 1), H - 6 - (v / MAX) * (H - 14)]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + ` L${pts[pts.length - 1][0].toFixed(1)} ${H} L${pts[0][0].toFixed(1)} ${H} Z`;

  return (
    <div>
      <div className="topbar">
        <div>
          <span className="demo-flag">{predicting ? "◷ Calculando clima en vivo…" : live ? "● Clima en vivo · Open-Meteo" : "● Datos de demostración"}</span>
          <h1 className="serif">Buenas, Explorador</h1>
          <p>{opening} hotspots entran en ventana de crecimiento esta semana.</p>
        </div>
        <button className="btn" onClick={onNewHotspot}>+ Nuevo hotspot</button>
      </div>

      <div className="pills">
        {PILLS.map((s) => (
          <button key={s} className={`pill${filter === s ? " on" : ""}`} onClick={() => { setFilter(s); toast(s === "all" ? "Todas las especies" : "Filtrando: " + s); }}>
            {s === "all" ? "Todas las especies" : s}
          </button>
        ))}
      </div>

      <div className="insight" onClick={onAskGuide}>
        <div className="ins-ic">{INSIGHT_ICON}</div>
        <div className="ins-txt">
          <b>Insight del día ·</b> Tu mejor zona ahora es <b>{top.name}</b> ({top.prob}% para {top.species.split(" ")[0]}). Hay {opening} hotspot{opening !== 1 ? "s" : ""} por encima del 70%. La ventana del hayedo cierra en ~4 días — prioriza esa salida.
        </div>
        <div className="ins-cta">Preguntar al guía →</div>
      </div>

      <div className="metrics">
        <div className="card reveal"><div className="k-label">Hotspots activos</div><div className="k-value">{hotspots.length}</div><span className="chip up">▲ 5 esta semana</span></div>
        <div className="card reveal"><div className="k-label">Prob. media</div><div className="k-value">{avg}<span className="u">%</span></div><span className="chip up">▲ 9 pts</span></div>
        <div className="card reveal"><div className="k-label">Próxima ventana</div><div className="k-value">{soonest}<span className="u"> días</span></div><span className="chip warn">{soonest <= 0 ? "abierta" : "se acerca"}</span></div>
        <div className="card reveal"><div className="k-label">Humedad acum. 7d</div><div className="k-value">82<span className="u">%</span></div><span className="chip up">óptima</span></div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="panel-head">
            <h3 className="serif">Mapa de hotspots</h3>
            <select className="select-mini" value={region.id} onChange={(e) => { const r = REGIONS.find((x) => x.id === e.target.value)!; setRegion(r); toast("Región: " + r.label); }}>
              {REGIONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </div>
          <div className="map">
            <div className="map-legend"><span className="lg-dot" />Punto caliente · prob. alta</div>
            <FungiMap hotspots={mapPoints} center={region.center} zoom={region.zoom} onSelect={(id) => setSelectedIdx(Number(id))} />
          </div>
          {sel && (
            <div className="explain">
              <div className="top">
                <div><div className="sp">{sel.species}</div><div className="hb">{sel.habitat} · {sel.alt} m · ladera {sel.aspect}</div></div>
                <div className="big">{sel.prob}%</div>
              </div>
              <div className="why"><b>Por qué:</b> {sel.why}</div>
              <div className="factors">{sel.factors.map((f, i) => <div className="factor" key={i}><div className="fl">{f[0]}</div><div className="fv">{f[1]}</div></div>)}</div>
              <GbifBadge species={sel.species} lat={sel.lat} lng={sel.lng} radius={25} />
            </div>
          )}
        </div>

        <div className="card">
          <div className="panel-head"><h3 className="serif">Tus hotspots</h3><span>{visible.length} sitios</span></div>
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
          <div className="panel-head"><h3 className="serif">Reloj de fructificación</h3></div>
          <div className="clock-wrap">
            <div className="clock">
              <svg width="84" height="84"><circle cx="42" cy="42" r="36" fill="none" stroke="#d6c4ac" strokeWidth="8" /><circle cx="42" cy="42" r="36" fill="none" stroke="#a86543" strokeWidth="8" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={dashOffset} /></svg>
              <div className="cv">{windowDays <= 0 ? "Ya" : `~${windowDays}d`}</div>
            </div>
            <div className="clock-info"><h4>{sel?.name}</h4><p>Pasaron {daysSinceRain} días desde la lluvia. {windowDays <= 0 ? "La ventana de fructificación está abierta ahora." : `La fructificación se abre en ~${windowDays} días.`}</p></div>
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--sand)" }}>
            <div style={{ fontSize: 11, color: "var(--stone)", textTransform: "uppercase", letterSpacing: ".5px", fontWeight: 600, marginBottom: 8 }}>Tendencia · últimos 14 días</div>
            <svg viewBox="0 0 260 60" style={{ width: "100%", height: 54 }}>
              <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a86543" stopOpacity=".3" /><stop offset="100%" stopColor="#a86543" stopOpacity="0" /></linearGradient></defs>
              <path d={area} fill="url(#tg)" />
              <path d={line} fill="none" stroke="#a86543" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={pts[pts.length - 1][0].toFixed(1)} cy={pts[pts.length - 1][1].toFixed(1)} r="3.5" fill="#8b3f29" />
            </svg>
          </div>
        </div>

        <div className="card">
          <div className="panel-head"><h3 className="serif">Diario de cosecha</h3><span>Aprende del modelo</span></div>
          <div>
            {diary.slice(0, 4).map((l, i) => (
              <div className="log-item" key={i}><span className={`log-dot ${l.found ? "ok" : "no"}`} /><span className="lt">{l.spot}</span><span className="lq">{l.found ? `${l.qty} kg · acertó` : "vacío · ajustando"}</span></div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="panel-head"><h3 className="serif">Privacidad</h3><span>Tus sitios</span></div>
          {hotspots.slice(0, 2).map((h, i) => (
            <div className="priv-row" key={i}><div className="pn">{h.name}</div><span className={`priv-tag ${h.priv}`}>{h.priv === "private" ? "Privado" : h.priv === "fuzzy" ? "Zona difusa" : "Compartido"}</span></div>
          ))}
          <div className="priv-row"><div className="pn">Alertas de ventana</div><span className="priv-tag shared">Activadas</span></div>
        </div>
      </div>
    </div>
  );
}
