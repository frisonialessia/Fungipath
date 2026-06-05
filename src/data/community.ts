// Comunidad (estilo iNaturalist) — SIMULADO, local, sin APIs ni coste.
// Observaciones verificables por consenso + actividad anónima por comarca (F4).

export type ObsStatus = "needs_id" | "research";

export interface Observation {
  id: string; species: string; comarca: string; hoursAgo: number; agrees: number; by: string;
}

export interface Contributor { name: string; finds: number; badge: string; }
export interface District { name: string; finds: number; trend: "up" | "flat"; }

export const OBSERVATIONS: Observation[] = [
  { id: "o1", species: "Boletus edulis", comarca: "Lago di Como", hoursAgo: 3, agrees: 4, by: "marco_b" },
  { id: "o2", species: "Cantharellus cibarius", comarca: "Brianza", hoursAgo: 6, agrees: 2, by: "lucia_f" },
  { id: "o3", species: "Amanita muscaria", comarca: "Valtellina", hoursAgo: 9, agrees: 5, by: "giorgio" },
  { id: "o4", species: "Morchella esculenta", comarca: "Ticino", hoursAgo: 14, agrees: 1, by: "ele_m" },
  { id: "o5", species: "Lactarius deliciosus", comarca: "Adamello", hoursAgo: 20, agrees: 3, by: "paolo_v" },
  { id: "o6", species: "Craterellus cornucopioides", comarca: "Orobie", hoursAgo: 26, agrees: 2, by: "sara_t" },
];

export const CONTRIBUTORS: Contributor[] = [
  { name: "marco_b", finds: 142, badge: "🥇" },
  { name: "lucia_f", finds: 118, badge: "🥈" },
  { name: "giorgio", finds: 97, badge: "🥉" },
  { name: "paolo_v", finds: 73, badge: "" },
  { name: "sara_t", finds: 61, badge: "" },
];

export const DISTRICTS: District[] = [
  { name: "Lago di Como", finds: 38, trend: "up" },
  { name: "Valtellina", finds: 27, trend: "up" },
  { name: "Brianza", finds: 21, trend: "flat" },
  { name: "Bergamo", finds: 16, trend: "up" },
  { name: "Oltrepò Pavese", finds: 9, trend: "flat" },
];
