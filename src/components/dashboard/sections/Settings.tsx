"use client";
import { useEffect, useState } from "react";
import type { Hotspot } from "@/data/hotspots";
import { SPECIES } from "@/lib/species";
import { useI18n, tx } from "@/lib/i18n";
import { useToast } from "../shared";
import LangToggle from "@/components/LangToggle";

interface Contact { name: string; phone: string; }
interface Prefs {
  name: string; type: string; level: string; species: string[]; favZones: string[];
  aWindow: boolean; aRain: boolean; aDigest: boolean; threshold: number; chEmail: boolean; chPush: boolean;
  units: "metric" | "imperial"; defPrivacy: string; email: string; contacts: Contact[];
}
const DEFAULTS: Prefs = {
  name: "Explorer", type: "tHobby", level: "lInter", species: ["Boletus edulis", "Cantharellus cibarius"], favZones: [],
  aWindow: true, aRain: true, aDigest: false, threshold: 70, chEmail: true, chPush: false,
  units: "metric", defPrivacy: "private", email: "", contacts: [],
};

export default function Settings({ hotspots }: { hotspots: Hotspot[] }) {
  const { t, locale } = useI18n();
  const toast = useToast();
  const [p, setP] = useState<Prefs>(DEFAULTS);

  useEffect(() => {
    try { const s = localStorage.getItem("fp_prefs"); if (s) setP({ ...DEFAULTS, ...JSON.parse(s) }); } catch { /* noop */ }
  }, []);
  const set = <K extends keyof Prefs>(k: K, v: Prefs[K]) => setP((x) => ({ ...x, [k]: v }));
  function save() { try { localStorage.setItem("fp_prefs", JSON.stringify(p)); } catch { /* noop */ } toast(t("settings.saved")); }

  const seg = (val: string, cur: string, on: () => void, label: string) => (
    <button key={val} className={`pill${cur === val ? " on" : ""}`} onClick={on}>{label}</button>
  );

  return (
    <div>
      <div className="topbar"><div><h1 className="serif">{t("settings.title")}</h1><p>{t("settings.sub")}</p></div><button className="btn" onClick={save}>{t("settings.save")}</button></div>

      <div className="grid-2" style={{ gridTemplateColumns: "1fr 1fr", alignItems: "start" }}>
        {/* PERFIL */}
        <div className="card">
          <div className="panel-head"><h3 className="serif">{t("settings.profile")}</h3></div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div className="avatar" style={{ width: 48, height: 48, fontSize: 20 }}>{(p.name || "E").charAt(0).toUpperCase()}</div>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}><label>{t("settings.displayName")}</label><input value={p.name} placeholder={t("settings.namePh")} onChange={(e) => set("name", e.target.value)} /></div>
          </div>
          <div className="field"><label>{t("settings.type")}</label><div className="pills">{["tHobby", "tSerious", "tSemipro", "tResearcher"].map((v) => seg(v, p.type, () => set("type", v), t(`settings.${v}`)))}</div></div>
          <div className="field"><label>{t("settings.level")}</label><div className="pills">{["lBeginner", "lInter", "lExpert"].map((v) => seg(v, p.level, () => set("level", v), t(`settings.${v}`)))}</div></div>
        </div>

        {/* INTERESES */}
        <div className="card">
          <div className="panel-head"><h3 className="serif">{t("settings.interests")}</h3></div>
          <div className="field"><label>{t("settings.intSpecies")}</label>
            <div className="pills">
              {SPECIES.filter((s) => s.edib === "choice" || s.edib === "edible").slice(0, 10).map((s) => {
                const on = p.species.includes(s.n);
                return <button key={s.n} className={`pill${on ? " on" : ""}`} onClick={() => set("species", on ? p.species.filter((x) => x !== s.n) : [...p.species, s.n])}>{tx(s.com, locale)}</button>;
              })}
            </div>
          </div>
          <div className="field" style={{ marginBottom: 0 }}><label>{t("settings.favZones")}</label>
            {hotspots.length ? (
              <div>
                {hotspots.map((h) => {
                  const on = p.favZones.includes(h.name);
                  return (
                    <div className="priv-row" key={h.name}>
                      <div><div className="pn">{h.name}</div><div style={{ fontSize: 12, color: "var(--stone)" }}>{h.species}</div></div>
                      <button className={`toggle${on ? "" : " off"}`} onClick={() => set("favZones", on ? p.favZones.filter((x) => x !== h.name) : [...p.favZones, h.name])} />
                    </div>
                  );
                })}
              </div>
            ) : <p style={{ fontSize: 12.5, color: "var(--stone)" }}>{t("settings.noZones")}</p>}
          </div>
        </div>

        {/* ALERTAS */}
        <div className="card">
          <div className="panel-head"><h3 className="serif">{t("settings.alerts")}</h3></div>
          {([["aWindow", "aWindowSub"], ["aRain", "aRainSub"], ["aDigest", "aDigestSub"]] as const).map(([k, sub]) => (
            <div className="priv-row" key={k}>
              <div><div className="pn">{t(`settings.${k}`)}</div><div style={{ fontSize: 12, color: "var(--stone)" }}>{t(`settings.${sub}`)}</div></div>
              <button className={`toggle${p[k] ? "" : " off"}`} onClick={() => set(k, !p[k])} />
            </div>
          ))}
          <div className="field" style={{ marginTop: 14 }}><label>{t("settings.threshold")} <b style={{ color: "var(--terracotta)", float: "right" }}>{p.threshold}%</b></label><input type="range" min={40} max={95} value={p.threshold} onChange={(e) => set("threshold", +e.target.value)} /><div style={{ fontSize: 11.5, color: "var(--stone)" }}>{t("settings.thresholdSub")}</div></div>
          <div className="field" style={{ marginBottom: 0 }}><label>{t("settings.channels")}</label><div className="pills">
            <button className={`pill${p.chEmail ? " on" : ""}`} onClick={() => set("chEmail", !p.chEmail)}>{t("settings.chEmail")}</button>
            <button className={`pill${p.chPush ? " on" : ""}`} onClick={() => set("chPush", !p.chPush)}>{t("settings.chPush")}</button>
          </div></div>
        </div>

        {/* PREFERENCIAS + CUENTA */}
        <div>
          <div className="card" style={{ marginBottom: 15 }}>
            <div className="panel-head"><h3 className="serif">{t("settings.prefs")}</h3></div>
            <div className="field"><label>{t("settings.units")}</label><div className="pills">{(["metric", "imperial"] as const).map((u) => seg(u, p.units, () => set("units", u), t(`settings.${u}`)))}</div></div>
            <div className="field"><label>{t("settings.defPrivacy")}</label><select className="select-mini" style={{ width: "100%", padding: "10px 12px" }} value={p.defPrivacy} onChange={(e) => set("defPrivacy", e.target.value)}><option value="private">{t("privacy.private")}</option><option value="fuzzy">{t("privacy.fuzzy")}</option><option value="shared">{t("privacy.shared")}</option></select></div>
            <div className="priv-row"><div className="pn">{t("settings.language")}</div><LangToggle /></div>
          </div>
          <div className="card">
            <div className="panel-head"><h3 className="serif">{t("settings.account")}</h3></div>
            <div className="field"><label>{t("settings.email")}</label><input type="email" placeholder={t("settings.emailPh")} value={p.email} onChange={(e) => set("email", e.target.value)} /></div>
            <div className="priv-row"><div className="pn">{t("settings.plan")}</div><span className="priv-tag fuzzy">{t("settings.planDemo")}</span></div>
            <div className="field" style={{ marginTop: 14, marginBottom: 8 }}><label>{t("settings.emergency")}</label></div>
            {p.contacts.length === 0 && <p style={{ fontSize: 12.5, color: "var(--stone)", marginBottom: 10 }}>{t("settings.noContacts")}</p>}
            {p.contacts.map((c, i) => (
              <div className="priv-row" key={i}><div className="pn">{c.name || "—"}</div><span style={{ fontSize: 12, color: "var(--stone)", fontFamily: "monospace" }}>{c.phone}</span></div>
            ))}
            <button className="btn-ghost2" style={{ width: "100%", marginTop: 6 }} onClick={() => set("contacts", [...p.contacts, { name: "", phone: "+34 600 000 000" }])}>{t("settings.addContact")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
