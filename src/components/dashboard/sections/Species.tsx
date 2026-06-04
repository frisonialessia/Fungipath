"use client";
import { useState } from "react";
import { SPECIES, SPECIES_TOTAL, FIELD_GUIDE, type Species as Sp } from "@/lib/species";
import { spIllust } from "@/lib/illustrations";
import { useI18n, tx } from "@/lib/i18n";
import { Illu } from "../shared";
import GbifBadge from "../GbifBadge";
import { IconBasket } from "@/components/icons";

const FILTERS = ["all", "choice", "edible", "toxic", "deadly"] as const;

export default function Species({ onAskGuide }: { onAskGuide: (name: string) => void }) {
  const { t, locale } = useI18n();
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState<Sp | null>(null);
  const [compare, setCompare] = useState<[Sp, Sp] | null>(null);

  const list = filter === "all" ? SPECIES : SPECIES.filter((s) => s.edib === filter);
  const filterLabel: Record<string, string> = { all: t("species.fAll"), choice: t("species.fChoice"), edible: t("species.fEdible"), toxic: t("species.fToxic"), deadly: t("species.fDeadly") };

  function openTwin(s: Sp) {
    const twinKey = s.twin.en.split(" ")[0];
    const twin = SPECIES.find((x) => x.n.split(" ")[0] === twinKey && x.n !== s.n);
    if (!twin) return;
    const safe = s.edib === "choice" || s.edib === "edible" ? s : twin;
    const danger = safe === s ? twin : s;
    setCompare([safe, danger]);
  }

  return (
    <div>
      <div className="topbar"><div><h1 className="serif">{t("species.title")}</h1><p>{t("species.sub", { n: SPECIES.length, total: SPECIES_TOTAL })}</p></div></div>
      <div className="pills" style={{ marginBottom: 20 }}>
        {FILTERS.map((f) => <button key={f} className={`pill${filter === f ? " on" : ""}`} onClick={() => setFilter(f)}>{filterLabel[f]}</button>)}
      </div>
      <div className="sp-grid">
        {list.map((s) => {
          const danger = s.edib === "deadly" || s.edib === "toxic";
          return (
            <div className="sp-card" key={s.n} onClick={() => setOpen(s)}>
              <div className="sp-plate">
                <Illu html={spIllust(s, 76)} />
                {danger && <span className="sp-danger">!</span>}
              </div>
              <div className="sp-info">
                <h4>{s.n}</h4>
                <div className="com">{tx(s.com, locale)}</div>
                <div className="sp-foot">
                  <span className={`edib ${s.edib}`}>{t(`edib.${s.edib}`)}</span>
                  <span className="sp-meta">{tx(s.hab, locale)} · {tx(s.season, locale)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {open && !compare && (
        <div className="modal-bg show" onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
          <SpeciesModal s={open} onClose={() => setOpen(null)} onCompare={() => openTwin(open)} onAsk={() => { onAskGuide(open.n); setOpen(null); }} />
        </div>
      )}

      {compare && (
        <div className="modal-bg show" onClick={(e) => { if (e.target === e.currentTarget) { setCompare(null); setOpen(null); } }}>
          <div className="modal">
            <h3 className="serif">{t("species.cmpTitle")}</h3>
            <p className="sub">{t("species.cmpSub")}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, margin: "16px 0" }}>
              <div style={{ background: "rgba(109,138,75,.12)", borderRadius: 14, padding: 16, textAlign: "center", border: "1.5px solid rgba(109,138,75,.3)" }}>
                <Illu html={spIllust(compare[0], 54)} /><div style={{ fontFamily: "Fraunces", fontStyle: "italic", fontSize: 15, marginTop: 8 }}>{compare[0].n}</div><span className={`edib ${compare[0].edib}`} style={{ marginTop: 8 }}>{t(`edib.${compare[0].edib}`)}</span>
              </div>
              <div style={{ background: "rgba(139,63,41,.1)", borderRadius: 14, padding: 16, textAlign: "center", border: "1.5px solid rgba(139,63,41,.3)" }}>
                <Illu html={spIllust(compare[1], 54)} /><div style={{ fontFamily: "Fraunces", fontStyle: "italic", fontSize: 15, marginTop: 8 }}>{compare[1].n}</div><span className={`edib ${compare[1].edib}`} style={{ marginTop: 8 }}>{t(`edib.${compare[1].edib}`)}</span>
              </div>
            </div>
            <div className="sp-meta" style={{ fontSize: 13 }}><b>{tx(compare[0].com, locale)}:</b> {tx(compare[0].note, locale)}<br /><br /><b>{tx(compare[1].com, locale)}:</b> {tx(compare[1].note, locale)}</div>
            <div className="warn-box"><b>⚠️ {t("species.cmpKey")}</b>{t("species.cmpKeyBody")}</div>
            <div className="modal-actions"><button className="btn-ghost2" onClick={() => { setCompare(null); setOpen(null); }}>{t("species.close")}</button><button className="btn" onClick={() => setCompare(null)}>{t("species.cmpBack")}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function SpeciesModal({ s, onClose, onCompare, onAsk }: { s: Sp; onClose: () => void; onCompare: () => void; onAsk: () => void }) {
  const { t, locale } = useI18n();
  const danger = s.edib === "deadly" || s.edib === "toxic";
  const twinKey = s.twin.en.split(" ")[0];
  const hasTwin = SPECIES.some((x) => x.n.split(" ")[0] === twinKey && x.n !== s.n);
  const g = FIELD_GUIDE[s.n];
  return (
    <div className="modal">
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <Illu style={{ flexShrink: 0 }} html={spIllust(s, 56)} />
        <div><h3 className="serif" style={{ fontStyle: "italic" }}>{s.n}</h3><p className="sub" style={{ margin: 0 }}>{tx(s.com, locale)}</p></div>
      </div>
      <span className={`edib ${s.edib}`}>{t(`edib.${s.edib}`)}</span>
      <div className="sp-meta" style={{ margin: "14px 0", fontSize: 14 }}>
        <b>{t("species.habitat")}</b> {tx(s.hab, locale)}<br /><b>{t("species.season")}</b> {tx(s.season, locale)}<br /><b>{t("species.id")}</b> {tx(s.note, locale)}<br /><b>{t("species.confusion")}</b> {tx(s.twin, locale)}<br /><b>{t("species.byRegion")}</b> {tx(s.region, locale)}
      </div>
      {g && (
        <div style={{ margin: "14px 0", padding: 14, background: "var(--cream-2)", borderRadius: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px", color: "var(--terracotta)", marginBottom: 10, display: "inline-flex", alignItems: "center", gap: 7 }}><IconBasket size={14} /> {t("species.fieldGuide")}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5, lineHeight: 1.45 }}>
            <div><b>{t("species.gHarvest")}</b> {tx(g.harvest, locale)}</div><div><b>{t("species.gDry")}</b> {tx(g.dry, locale)}</div><div><b>{t("species.gTouch")}</b> {tx(g.touch, locale)}</div><div><b>{t("species.gWhere")}</b> {tx(g.where, locale)}</div><div><b>{t("species.gClusters")}</b> {tx(g.clusters, locale)}</div><div><b>{t("species.gHours")}</b> {tx(g.hours, locale)}</div><div><b>{t("species.gPos")}</b> {tx(g.aspect, locale)}</div>
          </div>
        </div>
      )}
      {danger
        ? <div className="warn-box"><b>⚠️ {s.edib === "deadly" ? t("species.warnDeadly") : t("species.warnToxic")}</b>{t("species.warnDangerBody")}</div>
        : <div className="warn-box"><b>{t("species.warnSafe")}</b>{t("species.warnSafeBody")}</div>}
      <div className="modal-actions">
        {hasTwin && <button className="btn-ghost2" onClick={onCompare}>{t("species.compare")}</button>}
        <button className="btn" onClick={onAsk}>{t("species.ask")}</button>
      </div>
      <button className="back-link" style={{ color: "var(--stone)", marginTop: 8 }} onClick={onClose}>{t("species.close")}</button>
    </div>
  );
}
