"use client";
import { useState } from "react";
import { SPECIES, SPECIES_TOTAL, FIELD_GUIDE, type Species as Sp } from "@/lib/species";
import { spIllust } from "@/lib/illustrations";
import { Illu } from "../shared";
import GbifBadge from "../GbifBadge";

const FILTERS: [string, string][] = [
  ["all", "Todas"], ["choice", "Excelentes"], ["edible", "Comestibles"], ["toxic", "Tóxicas"], ["deadly", "Mortales"],
];

export default function Species({ onAskGuide }: { onAskGuide: (name: string) => void }) {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<Sp | null>(null);
  const [compare, setCompare] = useState<[Sp, Sp] | null>(null);

  const list = filter === "all" ? SPECIES : SPECIES.filter((s) => s.edib === filter);

  function openTwin(s: Sp) {
    const twin = SPECIES.find((t) => s.twin && t.n.split(" ")[0] === s.twin.split(" ")[0] && t.n !== s.n);
    if (!twin) return;
    const safe = s.edib === "choice" || s.edib === "edible" ? s : twin;
    const danger = safe === s ? twin : s;
    setCompare([safe, danger]);
  }

  return (
    <div>
      <div className="topbar"><div><h1 className="serif">Especies</h1><p>{SPECIES.length} especies ilustradas de un catálogo de {SPECIES_TOTAL}+. Toca una para ver su ficha, comestibilidad y sosias.</p></div></div>
      <div className="pills" style={{ marginBottom: 20 }}>
        {FILTERS.map(([f, label]) => <button key={f} className={`pill${filter === f ? " on" : ""}`} onClick={() => setFilter(f)}>{label}</button>)}
      </div>
      <div className="sp-grid">
        {list.map((s) => {
          const danger = s.edib === "deadly" || s.edib === "toxic";
          return (
            <div className="sp-card" key={s.n} onClick={() => setOpen(s)}>
              <div className="sp-top">
                <Illu className="sp-ill" html={spIllust(s, 46)} />
                <div><h4>{s.n}</h4><div className="com">{s.com}</div></div>
                {danger && <span style={{ marginLeft: "auto", width: 22, height: 22, borderRadius: "50%", background: "#8b3f29", color: "#fff", display: "grid", placeItems: "center", fontSize: 12, flexShrink: 0 }}>!</span>}
              </div>
              <span className={`edib ${s.edib}`}>{s.el}</span>
              <div className="sp-meta">{s.hab} · {s.season}</div>
            </div>
          );
        })}
      </div>

      {/* Modal ficha */}
      {open && !compare && (
        <div className="modal-bg show" onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
          <SpeciesModal s={open} onClose={() => setOpen(null)} onCompare={() => openTwin(open)} onAsk={() => { onAskGuide(open.n); setOpen(null); }} />
        </div>
      )}

      {/* Comparador de sosias */}
      {compare && (
        <div className="modal-bg show" onClick={(e) => { if (e.target === e.currentTarget) { setCompare(null); setOpen(null); } }}>
          <div className="modal">
            <h3 className="serif">Comparador de sosias</h3>
            <p className="sub">Aprende a distinguir el comestible de su gemelo peligroso.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, margin: "16px 0" }}>
              <div style={{ background: "rgba(109,138,75,.12)", borderRadius: 14, padding: 16, textAlign: "center", border: "1.5px solid rgba(109,138,75,.3)" }}>
                <Illu html={spIllust(compare[0], 54)} /><div style={{ fontFamily: "Fraunces", fontStyle: "italic", fontSize: 15, marginTop: 8 }}>{compare[0].n}</div><span className={`edib ${compare[0].edib}`} style={{ marginTop: 8 }}>{compare[0].el}</span>
              </div>
              <div style={{ background: "rgba(139,63,41,.1)", borderRadius: 14, padding: 16, textAlign: "center", border: "1.5px solid rgba(139,63,41,.3)" }}>
                <Illu html={spIllust(compare[1], 54)} /><div style={{ fontFamily: "Fraunces", fontStyle: "italic", fontSize: 15, marginTop: 8 }}>{compare[1].n}</div><span className={`edib ${compare[1].edib}`} style={{ marginTop: 8 }}>{compare[1].el}</span>
              </div>
            </div>
            <div className="sp-meta" style={{ fontSize: 13 }}><b>{compare[0].com}:</b> {compare[0].note}<br /><br /><b>{compare[1].com}:</b> {compare[1].note}</div>
            <div className="warn-box"><b>⚠️ Clave de seguridad</b>Ante la más mínima duda, NO consumas. La diferencia puede ser sutil y el error, mortal. Confirma siempre con un experto.</div>
            <div className="modal-actions"><button className="btn-ghost2" onClick={() => { setCompare(null); setOpen(null); }}>Cerrar</button><button className="btn" onClick={() => setCompare(null)}>Volver a la ficha</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function SpeciesModal({ s, onClose, onCompare, onAsk }: { s: Sp; onClose: () => void; onCompare: () => void; onAsk: () => void }) {
  const danger = s.edib === "deadly" || s.edib === "toxic";
  const hasTwin = SPECIES.some((t) => s.twin && t.n.split(" ")[0] === s.twin.split(" ")[0] && t.n !== s.n);
  const g = FIELD_GUIDE[s.n];
  return (
    <div className="modal">
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <Illu style={{ flexShrink: 0 }} html={spIllust(s, 56)} />
        <div><h3 className="serif" style={{ fontStyle: "italic" }}>{s.n}</h3><p className="sub" style={{ margin: 0 }}>{s.com}</p></div>
      </div>
      <span className={`edib ${s.edib}`}>{s.el}</span>
      <div className="sp-meta" style={{ margin: "14px 0", fontSize: 14 }}>
        <b>Hábitat:</b> {s.hab}<br /><b>Temporada:</b> {s.season}<br /><b>Identificación:</b> {s.note}<br /><b>Posible confusión:</b> {s.twin}<br /><b>Por región:</b> {s.region}
      </div>
      <GbifBadge species={s.n} variant="line" />
      {g && (
        <div style={{ margin: "14px 0", padding: 14, background: "var(--cream-2)", borderRadius: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px", color: "var(--terracotta)", marginBottom: 10 }}>🧺 Guía de campo</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5, lineHeight: 1.45 }}>
            <div><b>Cómo cosechar:</b> {g.harvest}</div><div><b>¿Se puede secar?:</b> {g.dry}</div><div><b>Al tacto:</b> {g.touch}</div><div><b>Dónde está:</b> {g.where}</div><div><b>¿Hay más cerca?:</b> {g.clusters}</div><div><b>Mejores horas:</b> {g.hours}</div><div><b>Posición:</b> {g.aspect}</div>
          </div>
        </div>
      )}
      {danger
        ? <div className="warn-box"><b>⚠️ {s.edib === "deadly" ? "ESPECIE MORTAL" : "ESPECIE TÓXICA"}</b>No consumir bajo ningún concepto. Mostrada con fines educativos y de identificación de sosias peligrosos.</div>
        : <div className="warn-box"><b>Antes de consumir</b>Verifica SIEMPRE con un micólogo o experto local. FungiPath educa, no autoriza el consumo.</div>}
      <div className="modal-actions">
        {hasTwin && <button className="btn-ghost2" onClick={onCompare}>Comparar sosias</button>}
        <button className="btn" onClick={onAsk}>Preguntar al guía</button>
      </div>
      <button className="back-link" style={{ color: "var(--stone)", marginTop: 8 }} onClick={onClose}>Cerrar</button>
    </div>
  );
}
