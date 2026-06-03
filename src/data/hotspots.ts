// MOCK (PoC): hotspots de demostración en la zona de Como / Lombardía.
// Cuando conectemos Supabase (Sprint 3), estos vienen de la BD; aquí son el fallback.
import type { Edibility } from "@/lib/species";

export type Privacy = "private" | "fuzzy" | "shared";

export interface Hotspot {
  name: string;
  species: string;
  alt: number;
  aspect: "N" | "S" | "E" | "O";
  habitat: string;
  prob: number;
  lat: number;
  lng: number;
  priv: Privacy;
  why: string;
  factors: [string, string][];
}

export interface DiaryEntry { spot: string; found: boolean; qty: number; }

export const MOCK_HOTSPOTS: Hotspot[] = [
  { name: "Hayedo del norte", species: "Boletus edulis", alt: 920, aspect: "N", habitat: "Hayedo", prob: 91, lat: 45.92, lng: 9.18, priv: "private",
    why: "llovió 40 mm hace 9 días, el suelo lleva 3 días a 14 °C y esta ladera norte retiene humedad. La ventana se mantiene ~4 días.",
    factors: [["Lluvia", "40mm · T-9d"], ["Temp suelo", "14 °C"], ["Orientación", "Norte"], ["NDVI", "0.78"]] },
  { name: "Robledal del río", species: "Cantharellus cibarius", alt: 640, aspect: "E", habitat: "Robledal", prob: 74, lat: 45.78, lng: 9.32, priv: "fuzzy",
    why: "humedad acumulada alta y temperatura media de 16 °C. El robledal mantiene sombra constante, ideal para Cantharellus.",
    factors: [["Lluvia", "28mm · T-6d"], ["Temp suelo", "16 °C"], ["Orientación", "Este"], ["NDVI", "0.71"]] },
  { name: "Pinar alto", species: "Lactarius deliciosus", alt: 1150, aspect: "O", habitat: "Pinar", prob: 58, lat: 46.05, lng: 9.45, priv: "private",
    why: "el pinar a 1.150 m está algo frío (11 °C) pero la humedad del 70% empieza a favorecer a Lactarius. Mejora prevista.",
    factors: [["Lluvia", "22mm · T-8d"], ["Temp suelo", "11 °C"], ["Orientación", "Oeste"], ["NDVI", "0.64"]] },
  { name: "Encinar sur", species: "Amanita caesarea", alt: 480, aspect: "S", habitat: "Encinar", prob: 42, lat: 45.70, lng: 9.05, priv: "private",
    why: "la ladera sur a baja altitud está más seca (humedad 55%). A. caesarea necesita más lluvia para activarse.",
    factors: [["Lluvia", "12mm · T-11d"], ["Temp suelo", "19 °C"], ["Orientación", "Sur"], ["NDVI", "0.58"]] },
  { name: "Castañar viejo", species: "Boletus edulis", alt: 780, aspect: "N", habitat: "Castañar", prob: 35, lat: 45.85, lng: 9.55, priv: "shared",
    why: "castañar con suelo ácido favorable, pero la última lluvia fue escasa. Probabilidad baja hasta nuevas precipitaciones.",
    factors: [["Lluvia", "9mm · T-13d"], ["Temp suelo", "15 °C"], ["Orientación", "Norte"], ["NDVI", "0.69"]] },
];

export const MOCK_DIARY: DiaryEntry[] = [
  { spot: "Hayedo del norte", found: true, qty: 1.2 },
  { spot: "Robledal del río", found: true, qty: 0.4 },
  { spot: "Pinar alto", found: false, qty: 0 },
  { spot: "Encinar sur", found: true, qty: 0.8 },
];

export const EDIB_LABEL: Record<Edibility, string> = {
  choice: "Excelente", edible: "Comestible", caution: "Precaución", toxic: "Tóxica", deadly: "MORTAL",
};
