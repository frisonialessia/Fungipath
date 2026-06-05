"use client";
import { useState } from "react";
import type { Hotspot, Privacy as Priv } from "@/data/hotspots";
import { useT } from "@/lib/i18n";
import { useToast } from "../shared";

export default function Privacy({ hotspots, onSetPriv }: { hotspots: Hotspot[]; onSetPriv: (i: number, v: Priv) => void }) {
  const t = useT();
  const toast = useToast();
  const [shareComarca, setShareComarca] = useState(false);
  const [alerts, setAlerts] = useState(true);

  function setPriv(i: number, v: Priv) { onSetPriv(i, v); toast(`${hotspots[i].name}: ${t(`privacy.${v}`)}`); }

  const levels: { k: Priv; d: string }[] = [
    { k: "private", d: t("privacy.pPrivateD") },
    { k: "fuzzy", d: t("privacy.pFuzzyD") },
    { k: "shared", d: t("privacy.pSharedD") },
  ];

  return (
    <div>
      <div className="topbar"><div><h1 className="serif">{t("privacy.title")}</h1><p>{t("privacy.sub")}</p></div></div>

      <div className="grid-2" style={{ gridTemplateColumns: "1.3fr 1fr", alignItems: "start" }}>
        <div>
          <div className="card" style={{ marginBottom: 15 }}>
            <div className="panel-head"><h3 className="serif">{t("privacy.perSite")}</h3><span>{hotspots.length}</span></div>
            {hotspots.map((h, i) => (
              <div className="priv-row" key={i}>
                <div><div className="pn">{h.name}</div><div style={{ fontSize: 12, color: "var(--stone)" }}>{h.species} · {h.alt} m</div></div>
                <select className="select-mini" value={h.priv} onChange={(e) => setPriv(i, e.target.value as Priv)}>
                  <option value="private">{t("privacy.private")}</option><option value="fuzzy">{t("privacy.fuzzy")}</option><option value="shared">{t("privacy.shared")}</option>
                </select>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="panel-head"><h3 className="serif">{t("privacy.more")}</h3></div>
            <div className="priv-row">
              <div><div className="pn">{t("privacy.shareComarca")}</div><div style={{ fontSize: 12, color: "var(--stone)" }}>{t("privacy.shareComarcaSub")}</div></div>
              <button className={`toggle${shareComarca ? "" : " off"}`} onClick={() => { setShareComarca((v) => !v); toast(t(shareComarca ? "privacy.toggledOff" : "privacy.toggledOn", { n: t("privacy.shareComarca") })); }} />
            </div>
            <div className="priv-row">
              <div><div className="pn">{t("privacy.alerts")}</div><div style={{ fontSize: 12, color: "var(--stone)" }}>{t("privacy.alertsSub")}</div></div>
              <button className={`toggle${alerts ? "" : " off"}`} onClick={() => { setAlerts((v) => !v); toast(t(alerts ? "privacy.toggledOff" : "privacy.toggledOn", { n: t("privacy.alerts") })); }} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="panel-head"><h3 className="serif">{t("privacy.howTitle")}</h3></div>
          {/* visual difuso vs preciso */}
          <div style={{ position: "relative", height: 150, borderRadius: 12, overflow: "hidden", border: "1px solid var(--sand)", background: "linear-gradient(160deg,#eef1e7,#e9e1cf 60%,#e4d3bc)", marginBottom: 16 }}>
            <div style={{ position: "absolute", top: "38%", left: "30%", width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,101,67,.35), transparent 70%)", transform: "translate(-50%,-50%)" }} />
            <div style={{ position: "absolute", top: "62%", left: "70%", width: 14, height: 14, borderRadius: "50% 50% 50% 0", background: "var(--clay)", border: "2px solid #faf5ec", transform: "translate(-50%,-100%) rotate(-45deg)" }} />
          </div>
          {levels.map((l) => (
            <div key={l.k} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid var(--sand)" }}>
              <span className={`priv-tag ${l.k}`} style={{ flexShrink: 0, marginTop: 2 }}>{t(`privacy.${l.k}`)}</span>
              <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.45 }}>{l.d}</div>
            </div>
          ))}
          <div className="warn-box" style={{ background: "rgba(168,101,67,.08)", borderColor: "rgba(168,101,67,.2)", color: "var(--umber)" }}>{t("privacy.principle")}</div>
        </div>
      </div>
    </div>
  );
}
