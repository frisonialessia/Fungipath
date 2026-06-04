// Zonas de bosque de Lombardía (mapa SVG de la vista Rutas) + regiones del mundo.
// MOCK (PoC): datos de demostración. Bilingüe EN/ES.
import type { Loc } from "@/lib/locale";

const L = (en: string, es: string): Loc => ({ en, es });

export interface Zone {
  id: string; name: string; hab: Loc; sector: "N" | "S" | "E" | "O";
  d: string; cx: number; cy: number; prob: number;
  alt: string; sp: Loc; spots: number; rain: string;
}

export const ZONES: Zone[] = [
  { id: "valtellina", name: "Valtellina", hab: L("Alps · conifers", "Alpes · coníferas"), sector: "N", d: "M280,60 L520,40 L640,110 L560,180 L380,160 L260,120 Z", cx: 430, cy: 105, prob: 84, alt: "1.200–2.000 m", sp: L("Lactarius, Boletus pinophilus", "Lactarius, Boletus pinophilus"), spots: 6, rain: "34mm · T-7d" },
  { id: "como", name: "Lago di Como", hab: L("Prealps · beech woods", "Prealpes · hayedos"), sector: "N", d: "M380,160 L560,180 L600,290 L470,330 L360,260 Z", cx: 475, cy: 240, prob: 88, alt: "600–1.400 m", sp: L("Boletus edulis, Craterellus", "Boletus edulis, Craterellus"), spots: 9, rain: "40mm · T-9d" },
  { id: "bergamo", name: "Bergamo", hab: L("Valleys · chestnut woods", "Valles · castañares"), sector: "E", d: "M600,290 L780,250 L840,360 L720,430 L600,380 Z", cx: 710, cy: 340, prob: 72, alt: "400–1.100 m", sp: L("Boletus, Amanita caesarea", "Boletus, Amanita caesarea"), spots: 5, rain: "26mm · T-8d" },
  { id: "brescia", name: "Brescia · Garda", hab: L("Lake · holm-oak woods", "Lago · encinares"), sector: "E", d: "M840,360 L1040,330 L1080,470 L900,510 L780,440 Z", cx: 920, cy: 420, prob: 65, alt: "200–900 m", sp: L("Amanita caesarea, Cantharellus", "Amanita caesarea, Cantharellus"), spots: 4, rain: "18mm · T-10d" },
  { id: "brianza", name: "Brianza", hab: L("Hills · oak woods", "Colinas · robledales"), sector: "O", d: "M360,260 L470,330 L440,450 L300,440 L280,330 Z", cx: 380, cy: 360, prob: 69, alt: "250–600 m", sp: L("Cantharellus, Boletus aereus", "Cantharellus, Boletus aereus"), spots: 7, rain: "30mm · T-6d" },
  { id: "milano", name: "Milano · plain", hab: L("Po plain", "Llanura del Po"), sector: "S", d: "M300,440 L600,380 L720,430 L680,560 L380,580 L300,500 Z", cx: 500, cy: 490, prob: 38, alt: "80–200 m", sp: L("Agaricus, scarce", "Agaricus, escasos"), spots: 2, rain: "14mm · T-12d" },
  { id: "pavia", name: "Oltrepò Pavese", hab: L("Apennines · oak woods", "Apeninos · robledales"), sector: "S", d: "M380,580 L680,560 L640,700 L420,720 L340,640 Z", cx: 510, cy: 640, prob: 58, alt: "300–1.000 m", sp: L("Boletus aereus, Lactarius", "Boletus aereus, Lactarius"), spots: 5, rain: "22mm · T-9d" },
];

export interface Region { id: string; label: Loc; center: [number, number]; zoom: number; }

export const REGIONS: Region[] = [
  { id: "medit", label: L("Mediterranean Europe", "Europa mediterránea"), center: [45.8, 9.1], zoom: 9 },
  { id: "iberia", label: L("Iberian Peninsula", "Península Ibérica"), center: [41.0, -4.5], zoom: 6 },
  { id: "alps", label: L("The Alps", "Los Alpes"), center: [46.5, 10.0], zoom: 7 },
  { id: "central", label: L("Central Europe", "Centroeuropa"), center: [48.2, 11.5], zoom: 7 },
  { id: "britain", label: L("British Isles", "Islas Británicas"), center: [54.0, -2.5], zoom: 6 },
  { id: "carpathians", label: L("Carpathians", "Cárpatos"), center: [47.5, 24.5], zoom: 6 },
  { id: "nordic", label: L("Scandinavia", "Escandinavia"), center: [61.0, 15.0], zoom: 5 },
  { id: "balkans", label: L("Balkans", "Balcanes"), center: [43.5, 21.0], zoom: 6 },
  { id: "namerica", label: L("North America · Pacific NW", "Norteamérica · Pacífico NW"), center: [45.5, -122.6], zoom: 7 },
  { id: "appalachia", label: L("North America · Appalachians", "Norteamérica · Apalaches"), center: [38.5, -80.0], zoom: 6 },
  { id: "california", label: L("California", "California"), center: [38.6, -122.6], zoom: 7 },
  { id: "japan", label: L("Japan", "Japón"), center: [36.2, 138.2], zoom: 6 },
  { id: "korea", label: L("Korea", "Corea"), center: [36.5, 127.9], zoom: 7 },
  { id: "patagonia", label: L("Patagonia", "Patagonia"), center: [-41.3, -71.5], zoom: 6 },
];

// Micorrizas: clave de icono + clave de árbol (texto desde messages) + hongos asociados.
export const MYCORRHIZA: [string, string][] = [
  ["broadleaf", "Boletus edulis, Craterellus"],
  ["acorn", "Boletus, Amanita caesarea"],
  ["conifer", "Lactarius deliciosus, Boletus pinophilus"],
  ["oak", "Boletus aereus, Cantharellus"],
  ["birch", "Leccinum, Amanita muscaria"],
];
