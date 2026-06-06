"use client";
import { useState } from "react";
import { useT } from "@/lib/i18n";
import { IconBasket, IconLens } from "@/components/icons";

const TICON = (
  <svg viewBox="0 0 26 26" fill="none" stroke="#ffa143" strokeWidth={2}>
    <circle cx="13" cy="13" r="10" /><path d="M13 8 L13 13 L17 16" strokeLinecap="round" />
  </svg>
);

// claves de mensaje + bandera "único"
const SETS = {
  collector: [["c1", false], ["c2", false], ["c3", true], ["c4", false], ["c5", true], ["c6", false]],
  learner: [["l1", true], ["l2", true], ["l3", false], ["l4", true], ["l5", false], ["l6", true]],
} as const;

export default function LandingTools() {
  const t = useT();
  const [aud, setAud] = useState<"collector" | "learner">("collector");
  return (
    <>
      <div className="audience-tabs">
        <button className={`tab${aud === "collector" ? " on" : ""}`} onClick={() => setAud("collector")} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><IconBasket size={16} /> {t("landing.tabCollector")}</button>
        <button className={`tab${aud === "learner" ? " on" : ""}`} onClick={() => setAud("learner")} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><IconLens size={16} /> {t("landing.tabLearner")}</button>
      </div>
      <div className="tool-grid">
        {SETS[aud].map(([key, unique]) => (
          <div className="tool" key={key}>
            {unique && <span className="tag-new">{t("landing.tagUnique")}</span>}
            <div className="ic">{TICON}</div>
            <h3>{t(`tools.${key}`)}</h3>
            <p>{t(`tools.${key}d`)}</p>
          </div>
        ))}
      </div>
    </>
  );
}
