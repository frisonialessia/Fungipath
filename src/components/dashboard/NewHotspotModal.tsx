"use client";
import { useState } from "react";
import { SPECIES } from "@/lib/species";
import { calcProbability, buildExplanation, type Aspect } from "@/lib/model";
import type { Hotspot } from "@/data/hotspots";
import { useI18n } from "@/lib/i18n";
import { useToast } from "./shared";

export default function NewHotspotModal({ onClose, onCreate, coords }: { onClose: () => void; onCreate: (h: Hotspot, enrich: boolean) => void; coords?: { lat: number; lng: number } }) {
  const { t, locale } = useI18n();
  const toast = useToast();
  const edible = SPECIES.filter((s) => s.edib === "choice" || s.edib === "edible");
  const aspects: { label: string; v: Aspect }[] = [
    { label: t("modal.aspN"), v: "N" }, { label: t("modal.aspS"), v: "S" }, { label: t("modal.aspE"), v: "E" }, { label: t("modal.aspO"), v: "O" },
  ];
  const [name, setName] = useState("");
  const [species, setSpecies] = useState(edible[0].n);
  const [alt, setAlt] = useState("");
  const [aspect, setAspect] = useState<Aspect>("N");
  const [rain, setRain] = useState(30);
  const [temp, setTemp] = useState(15);
  const fromMap = !!coords;

  function create() {
    const finalName = name.trim() || (locale === "en" ? "New site" : "Nuevo sitio");
    const altitude = parseInt(alt) || 800;
    const lat = coords ? coords.lat : 45.7 + Math.random() * 0.45;
    const lng = coords ? coords.lng : 9.0 + Math.random() * 0.6;

    if (fromMap) {
      onCreate({
        name: finalName, species, alt: altitude, aspect, habitat: locale === "en" ? "New" : "Nuevo", prob: 0, lat, lng, priv: "private",
        why: t("modal.calcReal"),
        factors: [["location", `${lat.toFixed(3)}, ${lng.toFixed(3)}`], ["aspect", aspect]],
      }, true);
      toast(t("modal.createdLive", { name: finalName }));
    } else {
      const prob = calcProbability({ rainMm: rain, soilTemp: temp, aspect });
      const ndvi = (0.55 + Math.random() * 0.25).toFixed(2);
      onCreate({
        name: finalName, species, alt: altitude, aspect, habitat: locale === "en" ? "New" : "Nuevo", prob, lat, lng, priv: "private",
        why: buildExplanation({ rainMm: rain, soilTemp: temp, aspect }, prob, locale),
        factors: [["rain", rain + "mm · T-0d"], ["soilTemp", temp + " °C"], ["aspect", aspect], ["ndvi", ndvi]],
      }, false);
      toast(t("modal.createdEst", { name: finalName, prob }));
    }
    onClose();
  }

  return (
    <div className="modal-bg show" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h3 className="serif">{t("modal.newTitle")}</h3>
        <p className="sub">{fromMap ? t("modal.newSubMap") : t("modal.newSub")}</p>
        {fromMap && coords && (
          <div className="warn-box" style={{ background: "rgba(109,138,75,.1)", borderColor: "rgba(109,138,75,.25)", color: "#54702f", marginBottom: 16, marginTop: 0 }}><b>{t("modal.mapLoc")}</b>{t("modal.mapLocBody", { lat: coords.lat.toFixed(5), lng: coords.lng.toFixed(5) })}</div>
        )}
        <div className="field"><label>{t("modal.fName")}</label><input placeholder={t("modal.fNamePh")} value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="field"><label>{t("modal.fSpecies")}</label><select value={species} onChange={(e) => setSpecies(e.target.value)}>{edible.map((s) => <option key={s.n}>{s.n}</option>)}</select></div>
        {!fromMap && <div className="field"><label>{t("modal.fAlt")}</label><input type="number" placeholder="920" value={alt} onChange={(e) => setAlt(e.target.value)} /></div>}
        <div className="field"><label>{t("modal.fAspect")}</label><select value={aspect} onChange={(e) => setAspect(e.target.value as Aspect)}>{aspects.map((a) => <option key={a.v} value={a.v}>{a.label}</option>)}</select></div>
        {!fromMap && <>
          <div className="field"><label>{t("modal.fRain")} <b style={{ color: "var(--terracotta)", float: "right" }}>{rain} mm</b></label><input type="range" min={0} max={80} value={rain} onChange={(e) => setRain(+e.target.value)} /></div>
          <div className="field"><label>{t("modal.fTemp")} <b style={{ color: "var(--terracotta)", float: "right" }}>{temp} °C</b></label><input type="range" min={4} max={28} value={temp} onChange={(e) => setTemp(+e.target.value)} /></div>
          <div className="warn-box" style={{ background: "rgba(168,101,67,.1)", borderColor: "rgba(168,101,67,.25)", color: "var(--umber)" }}><b>{t("modal.estTitle")}</b>{t("modal.estBody")}</div>
        </>}
        <div className="modal-actions"><button className="btn-ghost2" onClick={onClose}>{t("modal.cancel")}</button><button className="btn" onClick={create}>{t("modal.create")}</button></div>
      </div>
    </div>
  );
}
