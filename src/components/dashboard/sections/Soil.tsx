"use client";
import { MYCORRHIZA } from "@/data/zones";
import { treeIcon } from "@/components/icons";

// MOCK (PoC): pH, NDVI y humedad de ejemplo. El NDVI real (Sentinel-2) entra en la Fase 2.
export default function Soil() {
  return (
    <div>
      <div className="topbar"><div><h1 className="serif">Suelo &amp; terreno</h1><p>Datos de Sentinel-2 y muestreo. La base que determina qué especie prospera dónde.</p></div></div>
      <div className="grid-3" style={{ marginBottom: 15 }}>
        <div className="card"><div className="k-label">Humedad del suelo</div><div className="k-value">82<span className="u">%</span></div><span className="chip up">óptima para Boletus</span></div>
        <div className="card"><div className="k-label">pH medio</div><div className="k-value">5.4</div><span className="chip up">ácido · favorable</span></div>
        <div className="card"><div className="k-label">NDVI (vegetación)</div><div className="k-value">0.78</div><span className="chip up">dosel maduro</span></div>
      </div>
      <div className="card">
        <div className="panel-head"><h3 className="serif">Micorrizas por hábitat</h3><span>Qué árbol favorece qué hongo</span></div>
        <div>
          {MYCORRHIZA.map((m, i) => (
            <div className="myco-row" key={i}><div className="myco-tree" style={{ color: "var(--moss)" }}>{treeIcon(m[0], { size: 24 })}</div><div><div className="mt">{m[1]}</div></div><span className="myco-arrow">→</span><div className="ms">{m[2]}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}
