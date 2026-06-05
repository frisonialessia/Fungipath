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

  const finds = diary.filter((d) => d.found).length;
  const totalKg = diary.reduce((s, d) => s + (d.qty || 0), 0);
  const hitRate = diary.length ? Math.round((finds / diary.length) * 100) : 0;
  const bySite = Object.entries(diary.reduce<Record<string, number>>((m, d) => { m[d.spot] = (m[d.spot] || 0) + (d.qty || 0); return m; }, {})).sort((a, b) => b[1] - a[1]);
  const maxSite = Math.max(1, ...bySite.map((s) => s[1]));

  function open() { setSpot(hotspots[0]?.name ?? ""); setFound("yes"); setQty(""); setDate(today); setSpecies(""); setWeather("wCloud"); setNotes(""); setModal(true); }
  function save() {
    onAddLog({ spot: spot || hotspots[0]?.name || "Site", found: found === "yes", qty: parseFloat(qty) || 0, date, species: species || undefined, notes: notes || undefined, weather: t(`diary.${weather}`) });
    setModal(false); toast(t("diary.saved"));
  }

  return (
    <div>
      <div className="topbar"><div><h1 className="serif">{t("diary.title")}</h1><p>{t("diary.sub")}</p></div><button className="btn" onClick={open}>{t("diary.add")}</button></div>

      <div className="metrics" style={{ marginBottom: 15 }}>
        <div className="card reveal"><div className="k-label">{t("diary.mTrips")}</div><div className="k-value">{diary.length}</div></div>
        <div className="card reveal"><div className="k-label">{t("diary.mFinds")}</div><div className="k-value">{finds}</div></div>
        <div className="card reveal"><div className="k-label">{t("diary.mKg")}</div><div className="k-value">{totalKg.toFixed(1)}<span className="u"> kg</span></div></div>
        <div className="card reveal"><div className="k-label">{t("diary.mHit")}</div><div className="k-value">{hitRate}<span className="u">%</span></div></div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: "1.4fr 1fr", alignItems: "start" }}>
        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="panel-head"><h3 className="serif">{t("diary.recent")}</h3><span>{diary.length}</span></div>
          <div style={{ maxHeight: 460, overflowY: "auto", marginRight: -6, paddingRight: 6 }}>
            {diary.map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 0", borderBottom: "1px solid var(--sand)" }}>
                <span className={`log-dot ${l.found ? "ok" : "no"}`} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{l.spot}{l.species ? <span style={{ fontStyle: "italic", color: "var(--stone)", fontWeight: 400 }}> · {l.species}</span> : null}</div>
                  <div style={{ fontSize: 12, color: "var(--stone)", marginTop: 2 }}>{l.date ? l.date + " · " : ""}{l.weather ? l.weather + " · " : ""}{l.found ? t("diary.hit", { q: l.qty }) : t("diary.none")}{l.notes ? <span> · “{l.notes}”</span> : null}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 15 }}>
            <div className="panel-head"><h3 className="serif">{t("diary.bySite")}</h3></div>
            {bySite.length ? bySite.map(([name, kg]) => (
              <div key={name} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}><span style={{ fontWeight: 500 }}>{name}</span><span style={{ color: "var(--stone)" }}>{kg.toFixed(1)} kg</span></div>
                <div style={{ width: "100%", height: 6, background: "var(--sand)", borderRadius: 3, overflow: "hidden" }}><i style={{ display: "block", height: "100%", width: `${(kg / maxSite) * 100}%`, background: "var(--terracotta)" }} /></div>
              </div>
            )) : <p style={{ fontSize: 13, color: "var(--stone)" }}>—</p>}
          </div>
          <div className="card" style={{ background: "var(--ink)", color: "var(--cream)" }}>
            <div className="panel-head"><h3 className="serif" style={{ color: "var(--cream)" }}>{t("diary.learning")}</h3></div>
            <p style={{ fontSize: 13.5, color: "#cabdac", lineHeight: 1.6 }}>{t("diary.learningBody", { n: finds })}</p>
          </div>
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
