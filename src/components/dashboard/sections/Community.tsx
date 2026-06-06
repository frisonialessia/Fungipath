"use client";
import { useState } from "react";
import { OBSERVATIONS, CONTRIBUTORS, DISTRICTS, type Observation } from "@/data/community";
import { SPECIES } from "@/lib/species";
import { spIllust } from "@/lib/illustrations";
import { useI18n } from "@/lib/i18n";
import { Illu } from "../shared";

const RESEARCH_AT = 3;

export default function Community() {
  const { t } = useI18n();
  const [obs, setObs] = useState<Observation[]>(OBSERVATIONS);
  const [agreed, setAgreed] = useState<Set<string>>(new Set());
  const maxFinds = Math.max(...DISTRICTS.map((d) => d.finds));

  function agree(id: string) {
    if (agreed.has(id)) return;
    setObs((o) => o.map((x) => x.id === id ? { ...x, agrees: x.agrees + 1 } : x));
    setAgreed((s) => new Set(s).add(id));
  }
  const illu = (species: string) => {
    const sp = SPECIES.find((s) => s.n === species) || SPECIES.find((s) => s.n.split(" ")[0] === species.split(" ")[0]);
    return sp ? spIllust(sp, 38) : "";
  };

  return (
    <div>
      <div className="topbar"><div><span className="sim-flag">{t("overview.flagSim")}</span><h1 className="serif">{t("community.title")}</h1><p>{t("community.sub")}</p></div></div>

      <div className="grid-2" style={{ gridTemplateColumns: "1.5fr 1fr", alignItems: "start" }}>
        {/* FEED */}
        <div className="card">
          <div className="panel-head"><h3 className="serif">{t("community.feed")}</h3><span>{obs.length}</span></div>
          <div>
            {obs.map((o) => {
              const research = o.agrees >= RESEARCH_AT;
              const sp = SPECIES.find((s) => s.n === o.species);
              const danger = sp && (sp.edib === "deadly" || sp.edib === "toxic");
              return (
                <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--sand)" }}>
                  <Illu style={{ width: 40, height: 40, display: "grid", placeItems: "center", background: "var(--cream-2)", borderRadius: 11, flexShrink: 0 }} html={illu(o.species)} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontStyle: "italic", fontWeight: 600, fontSize: 14 }}>{o.species}{danger ? <span style={{ color: "var(--clay)", fontStyle: "normal" }}> · ⚠️</span> : null}</div>
                    <div style={{ fontSize: 12, color: "var(--stone)" }}>{o.comarca} · {t("community.by")} {o.by} · {t("community.ago", { h: o.hoursAgo })}</div>
                  </div>
                  <span className={`priv-tag ${research ? "shared" : "fuzzy"}`} style={{ flexShrink: 0 }}>{research ? t("community.research") : t("community.needsId")}</span>
                  <button className={`dl-btn${agreed.has(o.id) ? " done" : ""}`} style={{ flexShrink: 0 }} onClick={() => agree(o.id)}>{agreed.has(o.id) ? t("community.agreed") : t("community.agree")} · {o.agrees}</button>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 11.5, color: "var(--stone)", marginTop: 12, fontStyle: "italic" }}>{t("community.demo")}</div>
        </div>

        <div>
          {/* ACTIVIDAD POR COMARCA */}
          <div className="card" style={{ marginBottom: 15 }}>
            <div className="panel-head"><h3 className="serif">{t("community.district")}</h3><span>{t("community.districtAside")}</span></div>
            {DISTRICTS.map((d) => (
              <div key={d.name} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500 }}>{d.name} {d.trend === "up" ? <span style={{ color: "var(--moss)" }}>▲</span> : ""}</span>
                  <span style={{ color: "var(--stone)" }}>{d.finds} {t("community.finds")}</span>
                </div>
                <div className="bar" style={{ width: "100%", height: 6, background: "var(--sand)", borderRadius: 3, overflow: "hidden" }}><i style={{ display: "block", height: "100%", width: `${(d.finds / maxFinds) * 100}%`, background: "var(--terracotta)" }} /></div>
              </div>
            ))}
          </div>
          {/* RANKING */}
          <div className="card">
            <div className="panel-head"><h3 className="serif">{t("community.leaderboard")}</h3></div>
            {CONTRIBUTORS.map((c, i) => (
              <div className="priv-row" key={c.name}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 20, textAlign: "center", fontWeight: 700, color: "var(--stone)" }}>{c.badge || i + 1}</span>
                  <div className="pn">{c.name}</div>
                </div>
                <span style={{ fontSize: 12, color: "var(--stone)" }}>{c.finds} {t("community.validations")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
