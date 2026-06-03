"use client";
import { useState } from "react";
import { SPECIES } from "@/lib/species";
import { calcProbability, type Aspect } from "@/lib/model";
import type { Hotspot } from "@/data/hotspots";
import { useToast } from "./shared";

const ASPECTS: { label: string; v: Aspect }[] = [
  { label: "Norte", v: "N" }, { label: "Sur", v: "S" }, { label: "Este", v: "E" }, { label: "Oeste", v: "O" },
];
const ASPECT_NAME: Record<Aspect, string> = { N: "norte", S: "sur", E: "este", O: "oeste" };

export default function NewHotspotModal({ onClose, onCreate }: { onClose: () => void; onCreate: (h: Hotspot) => void }) {
  const toast = useToast();
  const edible = SPECIES.filter((s) => s.edib === "choice" || s.edib === "edible");
  const [name, setName] = useState("");
  const [species, setSpecies] = useState(edible[0].n);
  const [alt, setAlt] = useState("");
  const [aspect, setAspect] = useState<Aspect>("N");
  const [rain, setRain] = useState(30);
  const [temp, setTemp] = useState(15);

  function create() {
    const finalName = name.trim() || "Nuevo sitio";
    const altitude = parseInt(alt) || 800;
    const prob = calcProbability({ rainMm: rain, soilTemp: temp, aspect });
    const ndvi = (0.55 + Math.random() * 0.25).toFixed(2);
    const cond = prob >= 70 ? "Condiciones muy favorables." : prob >= 45 ? "Condiciones moderadas, vigila la evolución." : "Aún lejos del óptimo; necesita más lluvia o temperatura.";
    onCreate({
      name: finalName, species, alt: altitude, aspect, habitat: "Nuevo", prob,
      lat: 45.7 + Math.random() * 0.45, lng: 9.0 + Math.random() * 0.6, priv: "private",
      why: `con ${rain}mm de lluvia reciente y suelo a ${temp}°C en ladera ${ASPECT_NAME[aspect]}, el modelo estima ${prob}% de probabilidad. ${cond}`,
      factors: [["Lluvia", rain + "mm · T-0d"], ["Temp suelo", temp + " °C"], ["Orientación", aspect], ["NDVI", ndvi]],
    });
    toast(`✓ "${finalName}" creado · ${prob}% estimado`);
    onClose();
  }

  return (
    <div className="modal-bg show" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h3 className="serif">Nuevo hotspot</h3>
        <p className="sub">Marca un punto de interés. FungiPath empezará a predecir su actividad.</p>
        <div className="field"><label>Nombre del sitio</label><input placeholder="p. ej. Hayedo del norte" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="field"><label>Especie objetivo</label><select value={species} onChange={(e) => setSpecies(e.target.value)}>{edible.map((s) => <option key={s.n}>{s.n}</option>)}</select></div>
        <div className="field"><label>Altitud (m)</label><input type="number" placeholder="920" value={alt} onChange={(e) => setAlt(e.target.value)} /></div>
        <div className="field"><label>Orientación de ladera</label><select value={aspect} onChange={(e) => setAspect(e.target.value as Aspect)}>{ASPECTS.map((a) => <option key={a.v} value={a.v}>{a.label}</option>)}</select></div>
        <div className="field"><label>Lluvia reciente (mm) <b style={{ color: "var(--terracotta)", float: "right" }}>{rain} mm</b></label><input type="range" min={0} max={80} value={rain} onChange={(e) => setRain(+e.target.value)} /></div>
        <div className="field"><label>Temperatura media suelo <b style={{ color: "var(--terracotta)", float: "right" }}>{temp} °C</b></label><input type="range" min={4} max={28} value={temp} onChange={(e) => setTemp(+e.target.value)} /></div>
        <div className="warn-box" style={{ background: "rgba(168,101,67,.1)", borderColor: "rgba(168,101,67,.25)", color: "var(--umber)" }}><b>Predicción estimada</b>FungiPath calculará la probabilidad inicial con estos datos usando su modelo. Se afina con el tiempo.</div>
        <div className="modal-actions"><button className="btn-ghost2" onClick={onClose}>Cancelar</button><button className="btn" onClick={create}>Crear hotspot</button></div>
      </div>
    </div>
  );
}
