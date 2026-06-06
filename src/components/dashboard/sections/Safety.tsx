"use client";
import { useEffect, useRef, useState } from "react";
import { SPECIES } from "@/lib/species";
import { spIllust } from "@/lib/illustrations";
import { useT } from "@/lib/i18n";
import { Illu, useToast } from "../shared";
import { IconPlay, IconStop, IconPin, IconShare } from "@/components/icons";

// MOCK (PoC): rastreo GPS, SOS, modo offline y registro de hallazgos son simulados.
interface GpsFind { sp: string; co: string; t: string; }

export default function Safety() {
  const t = useT();
  const toast = useToast();
  const [tracking, setTracking] = useState(false);
  const [pts, setPts] = useState<[number, number][]>([]);
  const [minutes, setMinutes] = useState(0);
  const [finds, setFinds] = useState<GpsFind[]>([]);
  const [sos, setSos] = useState(false);
  const [offline, setOffline] = useState<Record<string, boolean>>({});
  const [offlineMsg, setOfflineMsg] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  function toggleTrack() {
    if (!tracking) {
      setTracking(true);
      setPts((p) => (p.length ? p : [[300, 180]]));
      timer.current = setInterval(() => {
        setPts((prev) => {
          const last = prev[prev.length - 1] || [300, 180];
          return [...prev, [Math.max(20, Math.min(580, last[0] + (Math.random() - 0.4) * 40)), Math.max(20, Math.min(340, last[1] + (Math.random() - 0.3) * 30))]];
        });
        setMinutes((m) => m + 0.025);
      }, 1500);
    } else {
      setTracking(false);
      if (timer.current) clearInterval(timer.current);
      toast(t("toast.routeSaved"));
    }
  }

  function addFind() {
    const sp = SPECIES[Math.floor(Math.random() * 8)];
    const lat = (45.90 + Math.random() * 0.1).toFixed(4), lng = (9.15 + Math.random() * 0.1).toFixed(4);
    const now = new Date();
    setFinds((f) => [{ sp: sp.n, co: `${lat}°N ${lng}°E`, t: now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0") }, ...f]);
    toast(t("safety.findLogged", { sp: sp.n }));
  }

  function dl(label: string) {
    setOffline((o) => ({ ...o, [label]: true }));
    setTimeout(() => setOfflineMsg(t("safety.offReady", { what: label })), 200);
  }

  const km = (pts.length * 0.18).toFixed(1);
  const path = pts.length > 1 ? `<polyline points="${pts.map((p) => p[0] + "," + p[1]).join(" ")}" fill="none" stroke="#8b3f29" stroke-width="2.5" stroke-dasharray="1 5" stroke-linecap="round"/>` : "";
  const dots = pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="${i === pts.length - 1 ? 4 : 2.5}" fill="${i === pts.length - 1 ? "#8b3f29" : "#ffa143"}"/>`).join("");
  const offItems = [t("safety.offMap"), t("safety.offSheets"), t("safety.offGuides")];

  return (
    <div>
      <div className="topbar"><div><h1 className="serif">{t("safety.title")}</h1><p>{t("safety.sub")}</p></div></div>
      <div className="grid-2" style={{ gridTemplateColumns: "1.3fr 1fr" }}>
        <div>
          <div className="card" style={{ marginBottom: 15 }}>
            <div className="panel-head"><h3 className="serif">{t("safety.trackTitle")}</h3><span style={{ color: tracking ? "#8b3f29" : "var(--stone)" }}>{tracking ? t("safety.recording") : t("safety.stopped")}</span></div>
            <div className="map" style={{ height: 260, background: "linear-gradient(160deg,#dce4d8,#e8dccd 60%,#e4d3bc)" }}>
              <Illu style={{ position: "absolute", inset: 0 }} html={`<svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%">${path}${dots}</svg>`} />
              {!pts.length && <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "var(--stone)", fontSize: 13, textAlign: "center", padding: 20 }}>{t("safety.trackHint")}</div>}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              <button className="btn" onClick={toggleTrack} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>{tracking ? <IconStop size={15} /> : <IconPlay size={15} />}{tracking ? t("safety.stop") : t("safety.start")}</button>
              <button className="btn-ghost2" style={{ flex: "none", padding: "12px 18px", display: "inline-flex", alignItems: "center", gap: 8 }} onClick={() => toast(t("safety.shared"))}><IconShare size={15} />{t("safety.shareLoc")}</button>
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 14 }}>
              <div><div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 22 }}>{km} km</div><div style={{ fontSize: 11, color: "var(--stone)", textTransform: "uppercase", letterSpacing: ".5px" }}>{t("safety.traveled")}</div></div>
              <div><div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 22 }}>{pts.length}</div><div style={{ fontSize: 11, color: "var(--stone)", textTransform: "uppercase", letterSpacing: ".5px" }}>{t("safety.points")}</div></div>
              <div><div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 22 }}>{Math.floor(minutes)} min</div><div style={{ fontSize: 11, color: "var(--stone)", textTransform: "uppercase", letterSpacing: ".5px" }}>{t("safety.onTrail")}</div></div>
            </div>
          </div>
          <div className="card">
            <div className="panel-head"><h3 className="serif">{t("safety.gpsTitle")}</h3><span>{t("safety.gpsAside")}</span></div>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 14 }}>{t("safety.gpsIntro")}</p>
            <div>
              {finds.length === 0
                ? <div style={{ fontSize: 12, color: "var(--stone)", textAlign: "center", padding: 14 }}>{t("safety.noFinds")}</div>
                : finds.map((f, i) => (
                  <div className="gps-find" key={i}>
                    <Illu html={spIllust(SPECIES.find((s) => s.n === f.sp) || SPECIES[0], 24)} />
                    <div><div style={{ fontStyle: "italic", fontFamily: "Plus Jakarta Sans" }}>{f.sp}</div><div style={{ fontSize: 11, color: "var(--stone)" }}>{f.t} h</div></div>
                    <span className="gf-co">{f.co}</span>
                  </div>
                ))}
            </div>
            <button className="btn" style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 8 }} onClick={addFind}><IconPin size={15} />{t("safety.markFind")}</button>
          </div>
        </div>
        <div>
          <div className="card" style={{ marginBottom: 15, background: "var(--ink)", color: "var(--cream)", textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#cabdac", marginBottom: 14 }}>{t("safety.emergency")}</div>
            <button className="sos-btn" onClick={() => { setSos(true); toast(t("safety.sosSent")); }}>SOS</button>
            <p style={{ fontSize: 12, color: "#cabdac", marginTop: 16, lineHeight: 1.5 }}>{t("safety.sosBody")}</p>
            {sos && <div style={{ marginTop: 16, padding: 12, background: "rgba(193,74,48,.2)", borderRadius: 10, fontSize: 12, color: "#f1d9d0", lineHeight: 1.5 }}><b>{t("safety.sosResult")}</b><br />{t("safety.sosResultBody")}</div>}
          </div>
          <div className="card">
            <div className="panel-head"><h3 className="serif">{t("safety.offlineTitle")}</h3></div>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 14 }}>{t("safety.offlineIntro")}</p>
            {offItems.map((what) => (
              <div className="offline-row" key={what}><span>{what}</span><button className={`dl-btn${offline[what] ? " done" : ""}`} onClick={() => dl(what)}>{offline[what] ? t("safety.available") : t("safety.download")}</button></div>
            ))}
            {offlineMsg && <div style={{ fontSize: 12, color: "var(--stone)", marginTop: 12 }}>{offlineMsg}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
