"use client";
import type { Hotspot } from "@/data/hotspots";
import { SPECIES } from "@/lib/species";
import { mushIcon } from "@/lib/illustrations";
import { useT } from "@/lib/i18n";
import { Illu } from "../shared";

export default function Predictions({ hotspots }: { hotspots: Hotspot[] }) {
  const t = useT();
  const sorted = [...hotspots].sort((a, b) => b.prob - a.prob);
  return (
    <div>
      <div className="topbar"><div><h1 className="serif">{t("predict.title")}</h1><p>{t("predict.sub")}</p></div></div>
      <div>
        {sorted.map((h, i) => {
          const c = SPECIES.find((s) => s.n.includes(h.species.split(" ")[0]))?.cap || "#ffa143";
          return (
            <div className="card" style={{ marginBottom: 12 }} key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Illu style={{ width: 46, height: 46, borderRadius: 12, background: "var(--cream-2)", display: "grid", placeItems: "center" }} html={mushIcon(h.species, SPECIES, c)} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{h.name}</div>
                  <div style={{ fontSize: 13, color: "var(--stone)" }}>{h.species} · {h.habitat} · {h.alt} m</div>
                </div>
                <div style={{ textAlign: "right", minWidth: 120 }}>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 28, color: h.prob < 50 ? "var(--clay)" : "var(--terracotta)" }}>{h.prob}%</div>
                  <div className="prob" style={{ margin: 0 }}><div className="bar" style={{ width: 120 }}><i style={{ width: `${h.prob}%` }} /></div></div>
                </div>
              </div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--sand)", fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.5 }}><b>{t("predict.why")}</b> {h.why}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
