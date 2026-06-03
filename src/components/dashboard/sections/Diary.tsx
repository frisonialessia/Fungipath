"use client";
import { useState } from "react";
import type { Hotspot, DiaryEntry } from "@/data/hotspots";
import { useToast } from "../shared";

export default function Diary({ diary, hotspots, onAddLog }: { diary: DiaryEntry[]; hotspots: Hotspot[]; onAddLog: (e: DiaryEntry) => void }) {
  const toast = useToast();
  const [modal, setModal] = useState(false);
  const [spot, setSpot] = useState(hotspots[0]?.name ?? "");
  const [found, setFound] = useState("yes");
  const [qty, setQty] = useState("");
  const foundCount = diary.filter((d) => d.found).length;

  function save() {
    onAddLog({ spot: spot || hotspots[0]?.name || "Sitio", found: found === "yes", qty: parseFloat(qty) || 0 });
    setModal(false); setQty("");
    toast("✓ Salida registrada · el modelo aprende");
  }

  return (
    <div>
      <div className="topbar"><div><h1 className="serif">Diario de cosecha</h1><p>Registra lo que encuentras. El modelo recalibra con cada entrada.</p></div><button className="btn" onClick={() => { setSpot(hotspots[0]?.name ?? ""); setModal(true); }}>+ Registrar salida</button></div>
      <div className="card">
        <div>
          {diary.map((l, i) => (
            <div className="log-item" style={{ padding: "14px 0" }} key={i}><span className={`log-dot ${l.found ? "ok" : "no"}`} /><span className="lt">{l.spot}</span><span className="lq">{l.found ? "Encontró · " + l.qty + " kg" : "Sin hallazgo"}</span></div>
          ))}
        </div>
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--sand)", fontSize: 13, color: "var(--ink-soft)" }}>
          <b>Aprendizaje del modelo:</b> con {foundCount} hallazgos confirmados, FungiPath ha recalibrado la predicción de tus hayedos +6% esta temporada.
        </div>
      </div>

      {modal && (
        <div className="modal-bg show" onClick={(e) => { if (e.target === e.currentTarget) setModal(false); }}>
          <div className="modal">
            <h3 className="serif">Registrar salida</h3>
            <p className="sub">¿Qué encontraste? Esto ayuda al modelo a aprender de tu terreno.</p>
            <div className="field"><label>Hotspot</label><select value={spot} onChange={(e) => setSpot(e.target.value)}>{hotspots.map((h) => <option key={h.name}>{h.name}</option>)}</select></div>
            <div className="field"><label>¿Encontraste?</label><select value={found} onChange={(e) => setFound(e.target.value)}><option value="yes">Sí, encontré</option><option value="no">No había nada</option></select></div>
            <div className="field"><label>Cantidad (kg)</label><input type="number" step="0.1" placeholder="1.2" value={qty} onChange={(e) => setQty(e.target.value)} /></div>
            <div className="modal-actions"><button className="btn-ghost2" onClick={() => setModal(false)}>Cancelar</button><button className="btn" onClick={save}>Guardar</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
