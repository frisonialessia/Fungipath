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

export interface DiaryEntry { spot: string; found: boolean; qty: number; date?: string; species?: string; notes?: string; weather?: string; }
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
  { name: L("Valtellina larch", "Alerce de Valtellina"), species: "Boletus pinophilus", alt: 1320, aspect: "N", habitat: L("Larch wood", "Alerzal"), prob: 63, lat: 46.17, lng: 9.87, priv: "private",
    why: L("High alpine larch, cool and damp — pine bolete territory.", "Alerzal alpino, fresco y húmedo — territorio de boleto de pino."),
    factors: [["rain", "30mm · T-7d"], ["soilTemp", "12 °C"], ["aspect", "N"], ["ndvi", "0.72"]] },
  { name: L("Bergamo chestnut", "Castañar de Bérgamo"), species: "Boletus aereus", alt: 700, aspect: "E", habitat: L("Chestnut wood", "Castañar"), prob: 68, lat: 45.84, lng: 9.78, priv: "private",
    why: L("Warm chestnut slopes, ideal for the bronze bolete.", "Laderas cálidas de castaño, ideales para el boleto negro."),
    factors: [["rain", "26mm · T-8d"], ["soilTemp", "17 °C"], ["aspect", "E"], ["ndvi", "0.70"]] },
  { name: L("Garda holm-oak", "Encinar del Garda"), species: "Amanita caesarea", alt: 320, aspect: "S", habitat: L("Holm-oak wood", "Encinar"), prob: 47, lat: 45.62, lng: 10.62, priv: "private",
    why: L("Mediterranean lake microclimate favours Caesar's mushroom.", "Microclima lacustre mediterráneo que favorece la oronja."),
    factors: [["rain", "16mm · T-9d"], ["soilTemp", "20 °C"], ["aspect", "S"], ["ndvi", "0.60"]] },
  { name: L("Ticino riverbank", "Ribera del Ticino"), species: "Morchella esculenta", alt: 180, aspect: "E", habitat: L("Riverbank", "Ribera"), prob: 52, lat: 45.42, lng: 8.78, priv: "fuzzy",
    why: L("Damp ash and poplar flats — classic spring morel ground.", "Llanos húmedos de fresno y chopo — terreno clásico de colmenilla."),
    factors: [["rain", "24mm · T-5d"], ["soilTemp", "13 °C"], ["aspect", "E"], ["ndvi", "0.66"]] },
  { name: L("Brianza oak", "Robledal de Brianza"), species: "Cantharellus cibarius", alt: 360, aspect: "O", habitat: L("Oak wood", "Robledal"), prob: 71, lat: 45.70, lng: 9.27, priv: "private",
    why: L("Mossy oak hills with steady shade — chanterelle colonies.", "Colinas de roble musgosas con sombra constante — colonias de rebozuelo."),
    factors: [["rain", "30mm · T-6d"], ["soilTemp", "16 °C"], ["aspect", "O"], ["ndvi", "0.74"]] },
  { name: L("Adamello pine", "Pinar del Adamello"), species: "Lactarius deliciosus", alt: 1450, aspect: "N", habitat: L("Pine wood", "Pinar"), prob: 55, lat: 46.15, lng: 10.50, priv: "private",
    why: L("High pine grassland, the saffron milk cap's home.", "Pasto de alta montaña bajo pinos, hogar del níscalo."),
    factors: [["rain", "22mm · T-8d"], ["soilTemp", "10 °C"], ["aspect", "N"], ["ndvi", "0.63"]] },
  { name: L("Oltrepò hills", "Colinas del Oltrepò"), species: "Boletus aereus", alt: 540, aspect: "S", habitat: L("Oak wood", "Robledal"), prob: 49, lat: 44.98, lng: 9.25, priv: "shared",
    why: L("Apennine oak ridges, drier but warming up nicely.", "Cordales de roble apeninos, más secos pero calentando bien."),
    factors: [["rain", "18mm · T-9d"], ["soilTemp", "18 °C"], ["aspect", "S"], ["ndvi", "0.61"]] },
  { name: L("Orobie beech", "Hayedo de las Orobie"), species: "Craterellus cornucopioides", alt: 1100, aspect: "N", habitat: L("Beech wood", "Hayedo"), prob: 66, lat: 46.00, lng: 9.90, priv: "private",
    why: L("Shaded beech north face holding moisture — horn of plenty.", "Cara norte de hayedo sombría que retiene humedad — trompeta de los muertos."),
    factors: [["rain", "34mm · T-7d"], ["soilTemp", "13 °C"], ["aspect", "N"], ["ndvi", "0.76"]] },
  { name: L("Pavia meadow", "Pradera de Pavía"), species: "Macrolepiota procera", alt: 90, aspect: "S", habitat: L("Meadow", "Pradera"), prob: 44, lat: 45.18, lng: 9.16, priv: "private",
    why: L("Open lowland pastures where parasols pop after rain.", "Pastos abiertos de llanura donde brotan parasoles tras la lluvia."),
    factors: [["rain", "20mm · T-6d"], ["soilTemp", "19 °C"], ["aspect", "S"], ["ndvi", "0.55"]] },
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
