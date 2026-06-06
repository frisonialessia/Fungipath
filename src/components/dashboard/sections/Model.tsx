"use client";
import type { Hotspot, DiaryEntry } from "@/data/hotspots";
import { hotspotCalibration, modelAccuracy, accuracyCurve } from "@/lib/learn";
import { useI18n } from "@/lib/i18n";

export default function Model({ hotspots, diary }: { hotspots: Hotspot[]; diary: DiaryEntry[] }) {
  const { t } = useI18n();
  const validations = diary.length;
  const accuracy = modelAccuracy(validations);
  const curve = accuracyCurve(validations);

  // curva SVG
  const W = 520, H = 90, MIN = 60, MAX = 96;
  const pts = curve.map((v, i) => [10 + i * (W - 20) / (curve.length - 1), H - 8 - ((v - MIN) / (MAX - MIN)) * (H - 18)]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + ` L${pts[pts.length - 1][0].toFixed(1)} ${H} L${pts[0][0].toFixed(1)} ${H} Z`;

  return (
    <div>
      <div className="topbar"><div>
        <span className="demo-flag">F3 · {t("model.moat")}</span>
        <h1 className="serif">{t("model.title")}</h1><p>{t("model.sub")}</p>
      </div></div>

      <div className="metrics" style={{ marginBottom: 15 }}>
        <div className="card reveal"><div className="k-label">{t("model.mVal")}</div><div className="k-value">{validations}</div><span className="chip up">▲ diario</span></div>
        <div className="card reveal"><div className="k-label">{t("model.mPred")}</div><div className="k-value">{hotspots.length}</div></div>
        <div className="card reveal"><div className="k-label">{t("model.mAcc")}</div><div className="k-value">{accuracy}<span className="u">%</span></div><span className="chip up">▲ {validations * 2} pts</span></div>
        <div className="card reveal"><div className="k-label">{t("model.mData")}</div><div className="k-value">{validations + hotspots.length}</div></div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: "1.4fr 1fr", alignItems: "start" }}>
        <div className="card">
          <div className="panel-head"><h3 className="serif">{t("model.recalTitle")}</h3><span>{t("model.curveAside")}</span></div>
          {/* curva */}
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 90, marginBottom: 10 }}>
            <defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffa143" stopOpacity=".25" /><stop offset="100%" stopColor="#ffa143" stopOpacity="0" /></linearGradient></defs>
            <path d={area} fill="url(#mg)" /><path d={line} fill="none" stroke="#ffa143" strokeWidth="2" strokeLinecap="round" />
            <circle cx={pts[pts.length - 1][0].toFixed(1)} cy={pts[pts.length - 1][1].toFixed(1)} r="3.5" fill="#8b3f29" />
          </svg>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, minWidth: 460 }}>
              <thead><tr style={{ color: "var(--stone)", textAlign: "left" }}>
                <th style={{ padding: "6px 8px", borderBottom: "1px solid var(--sand)", fontWeight: 600 }}>{t("overview.yourHotspots")}</th>
                <th style={{ padding: "6px 8px", borderBottom: "1px solid var(--sand)", fontWeight: 600 }}>{t("model.base")}</th>
                <th style={{ padding: "6px 8px", borderBottom: "1px solid var(--sand)", fontWeight: 600 }}>{t("model.learned")}</th>
                <th style={{ padding: "6px 8px", borderBottom: "1px solid var(--sand)", fontWeight: 600 }}>{t("model.reasonH")}</th>
              </tr></thead>
              <tbody>
                {hotspots.map((h) => {
                  const c = hotspotCalibration(h.name, diary);
                  const learned = Math.max(8, Math.min(97, h.prob + c.delta));
                  return (
                    <tr key={h.name} style={{ borderBottom: "1px solid var(--sand)" }}>
                      <td style={{ padding: "8px", whiteSpace: "nowrap" }}>{h.name}</td>
                      <td style={{ padding: "8px", color: "var(--stone)" }}>{h.prob}%</td>
                      <td style={{ padding: "8px", fontWeight: 700, color: c.delta > 0 ? "var(--moss)" : c.delta < 0 ? "var(--clay)" : "var(--ink)" }}>{learned}% {c.delta ? <span style={{ fontSize: 11 }}>({c.delta > 0 ? "+" : ""}{c.delta})</span> : ""}</td>
                      <td style={{ padding: "8px", color: "var(--ink-soft)", fontSize: 11.5 }}>{c.total ? t("model.rFound", { found: c.found, total: c.total }) : t("model.rNone")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ background: "var(--ink)", color: "var(--cream)" }}>
          <div className="panel-head"><h3 className="serif" style={{ color: "var(--cream)" }}>{t("model.moat")}</h3></div>
          <p style={{ fontSize: 14, color: "#cabdac", lineHeight: 1.6, marginBottom: 18 }}>{t("model.moatBody")}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderTop: "1px solid rgba(255,255,255,.12)", borderBottom: "1px solid rgba(255,255,255,.12)" }}>
            <div className="sim-big" style={{ fontSize: 40 }}>{accuracy}%</div>
            <div style={{ fontSize: 12, color: "#9c8f7d", textTransform: "uppercase", letterSpacing: ".5px" }}>{t("model.mAcc")}</div>
          </div>
          <div style={{ fontSize: 11.5, color: "#9c8f7d", marginTop: 14, lineHeight: 1.5, fontStyle: "italic" }}>{t("model.demo")}</div>
        </div>
      </div>
    </div>
  );
}
