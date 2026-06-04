"use client";
import { useState } from "react";
import type { Hotspot, DiaryEntry } from "@/data/hotspots";
import { useT } from "@/lib/i18n";
import { useToast } from "../shared";

export default function Diary({ diary, hotspots, onAddLog }: { diary: DiaryEntry[]; hotspots: Hotspot[]; onAddLog: (e: DiaryEntry) => void }) {
  const t = useT();
  const toast = useToast();
  const [modal, setModal] = useState(false);
  const [spot, setSpot] = useState(hotspots[0]?.name ?? "");
  const [found, setFound] = useState("yes");
  const [qty, setQty] = useState("");
  const foundCount = diary.filter((d) => d.found).length;

  function save() {
    onAddLog({ spot: spot || hotspots[0]?.name || "Site", found: found === "yes", qty: parseFloat(qty) || 0 });
    setModal(false); setQty("");
    toast(t("diary.saved"));
  }

  return (
    <div>
      <div className="topbar"><div><h1 className="serif">{t("diary.title")}</h1><p>{t("diary.sub")}</p></div><button className="btn" onClick={() => { setSpot(hotspots[0]?.name ?? ""); setModal(true); }}>{t("diary.add")}</button></div>
      <div className="card">
        <div>
          {diary.map((l, i) => (
            <div className="log-item" style={{ padding: "14px 0" }} key={i}><span className={`log-dot ${l.found ? "ok" : "no"}`} /><span className="lt">{l.spot}</span><span className="lq">{l.found ? t("diary.hit", { q: l.qty }) : t("diary.none")}</span></div>
          ))}
        </div>
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--sand)", fontSize: 13, color: "var(--ink-soft)" }}>
          <b>{t("diary.learning")}</b> {t("diary.learningBody", { n: foundCount })}
        </div>
      </div>

      {modal && (
        <div className="modal-bg show" onClick={(e) => { if (e.target === e.currentTarget) setModal(false); }}>
          <div className="modal">
            <h3 className="serif">{t("diary.mTitle")}</h3>
            <p className="sub">{t("diary.mSub")}</p>
            <div className="field"><label>{t("diary.fSpot")}</label><select value={spot} onChange={(e) => setSpot(e.target.value)}>{hotspots.map((h) => <option key={h.name}>{h.name}</option>)}</select></div>
            <div className="field"><label>{t("diary.fFound")}</label><select value={found} onChange={(e) => setFound(e.target.value)}><option value="yes">{t("diary.fYes")}</option><option value="no">{t("diary.fNo")}</option></select></div>
            <div className="field"><label>{t("diary.fQty")}</label><input type="number" step="0.1" placeholder="1.2" value={qty} onChange={(e) => setQty(e.target.value)} /></div>
            <div className="modal-actions"><button className="btn-ghost2" onClick={() => setModal(false)}>{t("diary.cancel")}</button><button className="btn" onClick={save}>{t("diary.save")}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
