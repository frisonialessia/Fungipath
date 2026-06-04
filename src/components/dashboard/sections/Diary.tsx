"use client";
import { useState } from "react";
import type { Hotspot, DiaryEntry } from "@/data/hotspots";
import { SPECIES } from "@/lib/species";
import { useI18n, tx } from "@/lib/i18n";
import { useToast } from "../shared";

export default function Diary({ diary, hotspots, onAddLog }: { diary: DiaryEntry[]; hotspots: Hotspot[]; onAddLog: (e: DiaryEntry) => void }) {
  const { t, locale } = useI18n();
  const toast = useToast();
  const today = new Date().toISOString().slice(0, 10);
  const [modal, setModal] = useState(false);
  const [spot, setSpot] = useState(hotspots[0]?.name ?? "");
  const [found, setFound] = useState("yes");
  const [qty, setQty] = useState("");
  const [date, setDate] = useState(today);
  const [species, setSpecies] = useState("");
  const [weather, setWeather] = useState("wCloud");
  const [notes, setNotes] = useState("");
  const foundCount = diary.filter((d) => d.found).length;

  function open() {
    setSpot(hotspots[0]?.name ?? ""); setFound("yes"); setQty(""); setDate(today);
    setSpecies(""); setWeather("wCloud"); setNotes(""); setModal(true);
  }
  function save() {
    onAddLog({
      spot: spot || hotspots[0]?.name || "Site", found: found === "yes", qty: parseFloat(qty) || 0,
      date, species: species || undefined, notes: notes || undefined, weather: t(`diary.${weather}`),
    });
    setModal(false); toast(t("diary.saved"));
  }

  return (
    <div>
      <div className="topbar"><div><h1 className="serif">{t("diary.title")}</h1><p>{t("diary.sub")}</p></div><button className="btn" onClick={open}>{t("diary.add")}</button></div>
      <div className="card">
        <div>
          {diary.map((l, i) => (
            <div key={i} style={{ padding: "13px 0", borderBottom: "1px solid var(--sand)", display: "flex", alignItems: "center", gap: 12 }}>
              <span className={`log-dot ${l.found ? "ok" : "no"}`} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{l.spot}{l.species ? <span style={{ fontStyle: "italic", color: "var(--stone)", fontWeight: 400 }}> · {l.species}</span> : null}</div>
                <div style={{ fontSize: 12, color: "var(--stone)", marginTop: 2 }}>
                  {l.date ? l.date + " · " : ""}{l.weather ? l.weather + " · " : ""}{l.found ? t("diary.hit", { q: l.qty }) : t("diary.none")}
                  {l.notes ? <span> · “{l.notes}”</span> : null}
                </div>
              </div>
            </div>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div className="field"><label>{t("diary.fSpot")}</label><select value={spot} onChange={(e) => setSpot(e.target.value)}>{hotspots.map((h) => <option key={h.name}>{h.name}</option>)}</select></div>
              <div className="field"><label>{t("diary.fDate")}</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
              <div className="field"><label>{t("diary.fFound")}</label><select value={found} onChange={(e) => setFound(e.target.value)}><option value="yes">{t("diary.fYes")}</option><option value="no">{t("diary.fNo")}</option></select></div>
              <div className="field"><label>{t("diary.fQty")}</label><input type="number" step="0.1" placeholder="1.2" value={qty} onChange={(e) => setQty(e.target.value)} /></div>
              <div className="field"><label>{t("diary.fSpecies")}</label><select value={species} onChange={(e) => setSpecies(e.target.value)}><option value="">{t("diary.fAny")}</option>{SPECIES.map((s) => <option key={s.n} value={s.n}>{s.n} ({tx(s.com, locale)})</option>)}</select></div>
              <div className="field"><label>{t("diary.fWeather")}</label><select value={weather} onChange={(e) => setWeather(e.target.value)}><option value="wSun">{t("diary.wSun")}</option><option value="wCloud">{t("diary.wCloud")}</option><option value="wRain">{t("diary.wRain")}</option></select></div>
            </div>
            <div className="field"><label>{t("diary.fNotes")}</label><input placeholder={t("diary.fNotesPh")} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
            <div className="modal-actions"><button className="btn-ghost2" onClick={() => setModal(false)}>{t("diary.cancel")}</button><button className="btn" onClick={save}>{t("diary.save")}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
