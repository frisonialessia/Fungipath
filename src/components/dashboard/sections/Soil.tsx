"use client";
import { MYCORRHIZA } from "@/data/zones";
import { treeIcon } from "@/components/icons";
import { useT } from "@/lib/i18n";

// MOCK (PoC): pH, NDVI y humedad de ejemplo. El NDVI real (Sentinel-2) entra en la Fase 2.
export default function Soil() {
  const t = useT();
  return (
    <div>
      <div className="topbar"><div><h1 className="serif">{t("soil.title")}</h1><p>{t("soil.sub")}</p></div></div>
      <div className="grid-3" style={{ marginBottom: 15 }}>
        <div className="card"><div className="k-label">{t("soil.moisture")}</div><div className="k-value">82<span className="u">%</span></div><span className="chip up">{t("soil.moistureChip")}</span></div>
        <div className="card"><div className="k-label">{t("soil.ph")}</div><div className="k-value">5.4</div><span className="chip up">{t("soil.phChip")}</span></div>
        <div className="card"><div className="k-label">{t("soil.ndvi")}</div><div className="k-value">0.78</div><span className="chip up">{t("soil.ndviChip")}</span></div>
      </div>
      <div className="card">
        <div className="panel-head"><h3 className="serif">{t("soil.mycoTitle")}</h3><span>{t("soil.mycoAside")}</span></div>
        <div>
          {MYCORRHIZA.map((m, i) => (
            <div className="myco-row" key={i}><div className="myco-tree" style={{ color: "var(--moss)" }}>{treeIcon(m[0], { size: 24 })}</div><div><div className="mt">{t(`soil.trees.${m[0]}`)}</div></div><span className="myco-arrow">→</span><div className="ms">{m[1]}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}
