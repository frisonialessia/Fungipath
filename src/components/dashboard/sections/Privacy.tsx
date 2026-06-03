"use client";
import { useState } from "react";
import type { Hotspot, Privacy as Priv } from "@/data/hotspots";
import { useToast } from "../shared";

export default function Privacy({ hotspots, onSetPriv }: { hotspots: Hotspot[]; onSetPriv: (i: number, v: Priv) => void }) {
  const toast = useToast();
  const [shareComarca, setShareComarca] = useState(false);
  const [alerts, setAlerts] = useState(true);

  function setPriv(i: number, v: Priv) {
    onSetPriv(i, v);
    toast(hotspots[i].name + ": " + (v === "private" ? "privado" : v === "fuzzy" ? "zona difusa" : "compartido"));
  }

  return (
    <div>
      <div className="topbar"><div><h1 className="serif">Privacidad</h1><p>Tú controlas qué se ve de tus sitios. Privado por defecto, siempre.</p></div></div>
      <div className="card">
        {hotspots.map((h, i) => (
          <div className="priv-row" key={i}>
            <div><div className="pn">{h.name}</div><div style={{ fontSize: 12, color: "var(--stone)" }}>{h.species} · {h.alt} m</div></div>
            <select className="select-mini" value={h.priv} onChange={(e) => setPriv(i, e.target.value as Priv)}>
              <option value="private">Privado</option><option value="fuzzy">Zona difusa</option><option value="shared">Compartido</option>
            </select>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 15 }}>
        <div className="priv-row">
          <div><div className="pn">Compartir actividad de comarca (anónima)</div><div style={{ fontSize: 12, color: "var(--stone)" }}>Muestra señal agregada sin revelar tus puntos exactos.</div></div>
          <button className={`toggle${shareComarca ? "" : " off"}`} onClick={() => { setShareComarca((v) => !v); toast("Compartir comarca" + (shareComarca ? " desactivado" : " activado")); }} />
        </div>
        <div className="priv-row">
          <div><div className="pn">Alertas de ventana óptima</div><div style={{ fontSize: 12, color: "var(--stone)" }}>Aviso push cuando tus zonas entran en óptimo.</div></div>
          <button className={`toggle${alerts ? "" : " off"}`} onClick={() => { setAlerts((v) => !v); toast("Alertas" + (alerts ? " desactivadas" : " activadas")); }} />
        </div>
      </div>
    </div>
  );
}
