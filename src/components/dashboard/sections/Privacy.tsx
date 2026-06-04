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

  function setPriv(i: number, v: Priv) {
    onSetPriv(i, v);
    toast(`${hotspots[i].name}: ${t(`privacy.${v}`)}`);
  }

  return (
    <div>
      <div className="topbar"><div><h1 className="serif">{t("privacy.title")}</h1><p>{t("privacy.sub")}</p></div></div>
      <div className="card">
        {hotspots.map((h, i) => (
          <div className="priv-row" key={i}>
            <div><div className="pn">{h.name}</div><div style={{ fontSize: 12, color: "var(--stone)" }}>{h.species} · {h.alt} m</div></div>
            <select className="select-mini" value={h.priv} onChange={(e) => setPriv(i, e.target.value as Priv)}>
              <option value="private">{t("privacy.private")}</option><option value="fuzzy">{t("privacy.fuzzy")}</option><option value="shared">{t("privacy.shared")}</option>
            </select>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 15 }}>
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
  );
}
