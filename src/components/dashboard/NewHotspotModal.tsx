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

export default function NewHotspotModal({ onClose, onCreate, coords }: { onClose: () => void; onCreate: (h: Hotspot, enrich: boolean) => void; coords?: { lat: number; lng: number } }) {
  const toast = useToast();
  const edible = SPECIES.filter((s) => s.edib === "choice" || s.edib === "edible");
  const [name, setName] = useState("");
  const [species, setSpecies] = useState(edible[0].n);
  const [alt, setAlt] = useState("");
  const [aspect, setAspect] = useState<Aspect>("N");
  const [rain, setRain] = useState(30);
  const [temp, setTemp] = useState(15);
  const fromMap = !!coords;

  function create() {
    const finalName = name.trim() || "Nuevo sitio";
    const altitude = parseInt(alt) || 800;
    const lat = coords ? coords.lat : 45.7 + Math.random() * 0.45;
    const lng = coords ? coords.lng : 9.0 + Math.random() * 0.6;

    if (fromMap) {
      // Punto real del mapa: lo creamos en "calculando" y enriquecemos con clima real.
      onCreate({
        name: finalName, species, alt: altitude, aspect, habitat: "Nuevo", prob: 0, lat, lng, priv: "private",
        why: "Calculando con el clima real de este punto (Open-Meteo)…",
        factors: [["Ubicación", `${lat.toFixed(3)}, ${lng.toFixed(3)}`], ["Orientación", ASPECT_NAME[aspect]]],
      }, true);
      toast(`"${finalName}" creado · prediciendo con clima real…`);
    } else {
      const prob = calcProbability({ rainMm: rain, soilTemp: temp, aspect });
      const cond = prob >= 70 ? "Condiciones muy favorables." : prob >= 45 ? "Condiciones moderadas, vigila la evolución." : "Aún lejos del óptimo; necesita más lluvia o temperatura.";
      const ndvi = (0.55 + Math.random() * 0.25).toFixed(2);
      onCreate({
        name: finalName, species, alt: altitude, aspect, habitat: "Nuevo", prob, lat, lng, priv: "private",
        why: `con ${rain}mm de lluvia reciente y suelo a ${temp}°C en ladera ${ASPECT_NAME[aspect]}, el modelo estima ${prob}% de probabilidad. ${cond}`,
        factors: [["Lluvia", rain + "mm · T-0d"], ["Temp suelo", temp + " °C"], ["Orientación", aspect], ["NDVI", ndvi]],
      }, false);
      toast(`"${finalName}" creado · ${prob}% estimado`);
    }
    onClose();
  }

  return (
    <div className="modal-bg show" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h3 className="serif">Nuevo hotspot</h3>
        <p className="sub">{fromMap ? "Punto seleccionado en el mapa. Predeciremos con el clima real de estas coordenadas." : "Marca un punto de interés. FungiPath empezará a predecir su actividad."}</p>
        {fromMap && coords && (
          <div className="warn-box" style={{ background: "rgba(109,138,75,.1)", borderColor: "rgba(109,138,75,.25)", color: "#54702f", marginBottom: 16, marginTop: 0 }}><b>Ubicación del mapa</b>{coords.lat.toFixed(5)}°, {coords.lng.toFixed(5)}° · la altitud y la probabilidad se calcularán con datos reales (Open-Meteo).</div>
        )}
        <div className="field"><label>Nombre del sitio</label><input placeholder="p. ej. Hayedo del norte" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="field"><label>Especie objetivo</label><select value={species} onChange={(e) => setSpecies(e.target.value)}>{edible.map((s) => <option key={s.n}>{s.n}</option>)}</select></div>
        {!fromMap && <div className="field"><label>Altitud (m)</label><input type="number" placeholder="920" value={alt} onChange={(e) => setAlt(e.target.value)} /></div>}
        <div className="field"><label>Orientación de ladera</label><select value={aspect} onChange={(e) => setAspect(e.target.value as Aspect)}>{ASPECTS.map((a) => <option key={a.v} value={a.v}>{a.label}</option>)}</select></div>
        {!fromMap && <>
          <div className="field"><label>Lluvia reciente (mm) <b style={{ color: "var(--terracotta)", float: "right" }}>{rain} mm</b></label><input type="range" min={0} max={80} value={rain} onChange={(e) => setRain(+e.target.value)} /></div>
          <div className="field"><label>Temperatura media suelo <b style={{ color: "var(--terracotta)", float: "right" }}>{temp} °C</b></label><input type="range" min={4} max={28} value={temp} onChange={(e) => setTemp(+e.target.value)} /></div>
          <div className="warn-box" style={{ background: "rgba(168,101,67,.1)", borderColor: "rgba(168,101,67,.25)", color: "var(--umber)" }}><b>Predicción estimada</b>FungiPath calculará la probabilidad inicial con estos datos usando su modelo. Se afina con el tiempo.</div>
        </>}
        <div className="modal-actions"><button className="btn-ghost2" onClick={onClose}>Cancelar</button><button className="btn" onClick={create}>Crear hotspot</button></div>
      </div>
    </div>
  );
}
