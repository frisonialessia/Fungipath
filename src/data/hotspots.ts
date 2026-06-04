// MOCK (PoC): hotspots de demostración en la zona de Como / Lombardía.
// Bilingüe: el "seed" guarda los textos en EN/ES y se localiza al cargar.
// Las predicciones reales (Open-Meteo) sobrescriben prob/why/factors al vuelo.
import type { Loc, Locale } from "@/lib/locale";
import { tx } from "@/lib/locale";

export type Aspect = "N" | "S" | "E" | "O";
export type Privacy = "private" | "fuzzy" | "shared";

// factors: pares [clave, valor]. La clave se traduce (factor.*) y, si es "aspect",
// el valor (letra N/S/E/O) también se traduce en el render.
export interface Hotspot {
  name: string; species: string; alt: number; aspect: Aspect; habitat: string;
  prob: number; lat: number; lng: number; priv: Privacy;
  why: string; factors: [string, string][];
  live?: boolean; rainMm?: number; soilTemp?: number; daysSinceRain?: number; windowDays?: number;
}

export interface DiaryEntry { spot: string; found: boolean; qty: number; }
export const ASPECT_NAME: Record<Aspect, string> = { N: "norte", S: "sur", E: "este", O: "oeste" };

const L = (en: string, es: string): Loc => ({ en, es });

interface Seed {
  name: Loc; species: string; alt: number; aspect: Aspect; habitat: Loc; prob: number;
  lat: number; lng: number; priv: Privacy; why: Loc; factors: [string, string][];
}

const SEED: Seed[] = [
  { name: L("North beech wood", "Hayedo del norte"), species: "Boletus edulis", alt: 920, aspect: "N", habitat: L("Beech wood", "Hayedo"), prob: 91, lat: 45.92, lng: 9.18, priv: "private",
    why: L("40 mm of rain fell 9 days ago, the soil has been at 14 °C for 3 days and this north slope holds moisture. The window stays open ~4 days.", "llovió 40 mm hace 9 días, el suelo lleva 3 días a 14 °C y esta ladera norte retiene humedad. La ventana se mantiene ~4 días."),
    factors: [["rain", "40mm · T-9d"], ["soilTemp", "14 °C"], ["aspect", "N"], ["ndvi", "0.78"]] },
  { name: L("Riverside oak wood", "Robledal del río"), species: "Cantharellus cibarius", alt: 640, aspect: "E", habitat: L("Oak wood", "Robledal"), prob: 74, lat: 45.78, lng: 9.32, priv: "fuzzy",
    why: L("High accumulated moisture and an average temperature of 16 °C. The oak wood keeps constant shade, ideal for Cantharellus.", "humedad acumulada alta y temperatura media de 16 °C. El robledal mantiene sombra constante, ideal para Cantharellus."),
    factors: [["rain", "28mm · T-6d"], ["soilTemp", "16 °C"], ["aspect", "E"], ["ndvi", "0.71"]] },
  { name: L("High pine wood", "Pinar alto"), species: "Lactarius deliciosus", alt: 1150, aspect: "O", habitat: L("Pine wood", "Pinar"), prob: 58, lat: 46.05, lng: 9.45, priv: "private",
    why: L("The pine wood at 1,150 m is a bit cold (11 °C) but 70% humidity is starting to favor Lactarius. Improvement expected.", "el pinar a 1.150 m está algo frío (11 °C) pero la humedad del 70% empieza a favorecer a Lactarius. Mejora prevista."),
    factors: [["rain", "22mm · T-8d"], ["soilTemp", "11 °C"], ["aspect", "O"], ["ndvi", "0.64"]] },
  { name: L("South holm-oak wood", "Encinar sur"), species: "Amanita caesarea", alt: 480, aspect: "S", habitat: L("Holm-oak wood", "Encinar"), prob: 42, lat: 45.70, lng: 9.05, priv: "private",
    why: L("The south slope at low altitude is drier (55% humidity). A. caesarea needs more rain to activate.", "la ladera sur a baja altitud está más seca (humedad 55%). A. caesarea necesita más lluvia para activarse."),
    factors: [["rain", "12mm · T-11d"], ["soilTemp", "19 °C"], ["aspect", "S"], ["ndvi", "0.58"]] },
  { name: L("Old chestnut wood", "Castañar viejo"), species: "Boletus edulis", alt: 780, aspect: "N", habitat: L("Chestnut wood", "Castañar"), prob: 35, lat: 45.85, lng: 9.55, priv: "shared",
    why: L("Chestnut wood with favorable acidic soil, but the last rain was scarce. Low probability until new rainfall.", "castañar con suelo ácido favorable, pero la última lluvia fue escasa. Probabilidad baja hasta nuevas precipitaciones."),
    factors: [["rain", "9mm · T-13d"], ["soilTemp", "15 °C"], ["aspect", "N"], ["ndvi", "0.69"]] },
];

// Construye los hotspots localizados al idioma activo.
export function localizedHotspots(locale: Locale): Hotspot[] {
  return SEED.map((s) => ({
    name: tx(s.name, locale), species: s.species, alt: s.alt, aspect: s.aspect, habitat: tx(s.habitat, locale),
    prob: s.prob, lat: s.lat, lng: s.lng, priv: s.priv, why: tx(s.why, locale), factors: s.factors,
  }));
}

const DIARY_SEED: { spot: number; found: boolean; qty: number }[] = [
  { spot: 0, found: true, qty: 1.2 }, { spot: 1, found: true, qty: 0.4 }, { spot: 2, found: false, qty: 0 }, { spot: 3, found: true, qty: 0.8 },
];
export function localizedDiary(locale: Locale): DiaryEntry[] {
  return DIARY_SEED.map((d) => ({ spot: tx(SEED[d.spot].name, locale), found: d.found, qty: d.qty }));
}
