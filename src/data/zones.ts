// Zonas de bosque de Lombardía (mapa SVG de la vista Rutas) + regiones del mundo.
// MOCK (PoC): datos de demostración. Portado de fungipath-app-v4.

export interface Zone {
  id: string; name: string; hab: string; sector: "N" | "S" | "E" | "O";
  d: string; cx: number; cy: number; prob: number;
  alt: string; sp: string; spots: number; rain: string;
}

export const ZONES: Zone[] = [
  { id: "valtellina", name: "Valtellina", hab: "Alpes · coníferas", sector: "N", d: "M280,60 L520,40 L640,110 L560,180 L380,160 L260,120 Z", cx: 430, cy: 105, prob: 84, alt: "1.200–2.000 m", sp: "Lactarius, Boletus pinophilus", spots: 6, rain: "34mm · T-7d" },
  { id: "como", name: "Lago de Como", hab: "Prealpes · hayedos", sector: "N", d: "M380,160 L560,180 L600,290 L470,330 L360,260 Z", cx: 475, cy: 240, prob: 88, alt: "600–1.400 m", sp: "Boletus edulis, Craterellus", spots: 9, rain: "40mm · T-9d" },
  { id: "bergamo", name: "Bérgamo", hab: "Valles · castañares", sector: "E", d: "M600,290 L780,250 L840,360 L720,430 L600,380 Z", cx: 710, cy: 340, prob: 72, alt: "400–1.100 m", sp: "Boletus, Amanita caesarea", spots: 5, rain: "26mm · T-8d" },
  { id: "brescia", name: "Brescia · Garda", hab: "Lago · encinares", sector: "E", d: "M840,360 L1040,330 L1080,470 L900,510 L780,440 Z", cx: 920, cy: 420, prob: 65, alt: "200–900 m", sp: "Amanita caesarea, Cantharellus", spots: 4, rain: "18mm · T-10d" },
  { id: "brianza", name: "Brianza", hab: "Colinas · robledales", sector: "O", d: "M360,260 L470,330 L440,450 L300,440 L280,330 Z", cx: 380, cy: 360, prob: 69, alt: "250–600 m", sp: "Cantharellus, Boletus aereus", spots: 7, rain: "30mm · T-6d" },
  { id: "milano", name: "Milán · llanura", hab: "Llanura del Po", sector: "S", d: "M300,440 L600,380 L720,430 L680,560 L380,580 L300,500 Z", cx: 500, cy: 490, prob: 38, alt: "80–200 m", sp: "Agaricus, escasos", spots: 2, rain: "14mm · T-12d" },
  { id: "pavia", name: "Oltrepò Pavese", hab: "Apeninos · robledales", sector: "S", d: "M380,580 L680,560 L640,700 L420,720 L340,640 Z", cx: 510, cy: 640, prob: 58, alt: "300–1.000 m", sp: "Boletus aereus, Lactarius", spots: 5, rain: "22mm · T-9d" },
];

export interface Region { id: string; label: string; sp: string; center: [number, number]; zoom: number; }

export const REGIONS: Region[] = [
  { id: "medit", label: "Europa mediterránea", sp: "Boletus, Amanita caesarea, Níscalo", center: [45.8, 9.1], zoom: 9 },
  { id: "central", label: "Centroeuropa", sp: "Boletus edulis, Cantharellus, Trompeta", center: [48.2, 11.5], zoom: 8 },
  { id: "nordic", label: "Escandinavia", sp: "Cantharellus, Lactarius, Boletus pinophilus", center: [60.3, 15.5], zoom: 7 },
  { id: "namerica", label: "Norteamérica · Pacífico NW", sp: "Cantharellus, Morchella, Boletus", center: [45.5, -122.6], zoom: 8 },
  { id: "japan", label: "Japón", sp: "Matsutake, Shiitake, Enoki", center: [36.2, 138.2], zoom: 8 },
];

// Micorrizas: qué árbol favorece qué hongo (vista Suelo).
export const MYCORRHIZA: [string, string, string][] = [
  ["🌳", "Haya (Fagus)", "Boletus edulis, Craterellus"],
  ["🌰", "Castaño", "Boletus, Amanita caesarea"],
  ["🌲", "Pino", "Lactarius deliciosus, Boletus pinophilus"],
  ["🌿", "Roble (Quercus)", "Boletus aereus, Cantharellus"],
  ["🪾", "Abedul", "Leccinum, Amanita muscaria"],
];
