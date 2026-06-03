"use client";
import { useState } from "react";
import { TOOLS } from "@/data/landing";
import { IconBasket, IconLens } from "@/components/icons";

const TICON = (
  <svg viewBox="0 0 26 26" fill="none" stroke="#a86543" strokeWidth={2}>
    <circle cx="13" cy="13" r="10" />
    <path d="M13 8 L13 13 L17 16" strokeLinecap="round" />
  </svg>
);

export default function LandingTools() {
  const [aud, setAud] = useState<"collector" | "learner">("collector");
  return (
    <>
      <div className="audience-tabs">
        <button className={`tab${aud === "collector" ? " on" : ""}`} onClick={() => setAud("collector")} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><IconBasket size={16} /> Recolector serio</button>
        <button className={`tab${aud === "learner" ? " on" : ""}`} onClick={() => setAud("learner")} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><IconLens size={16} /> Aficionado / aprendiz</button>
      </div>
      <div className="tool-grid">
        {TOOLS[aud].map((x) => (
          <div className="tool" key={x.n}>
            {x.unique && <span className="tag-new">Único</span>}
            <div className="ic">{TICON}</div>
            <h3>{x.n}</h3>
            <p>{x.t}</p>
          </div>
        ))}
      </div>
    </>
  );
}
