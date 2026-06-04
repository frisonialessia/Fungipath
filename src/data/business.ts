// Trazabilidad de negocio: lotes de cosecha (recolección → comprador).
// MOCK (PoC): se persiste en localStorage. Clave para vender legalmente.
export type LotStatus = "harvested" | "sold" | "delivered";
export type Grade = "A" | "B" | "C";

export interface Lot {
  id: string; code: string; date: string;
  species: string; kg: number; grade: Grade;
  origin: string;        // hotspot/zona de origen
  buyer: string;         // comprador
  pricePerKg: number;    // €/kg
  status: LotStatus;
}

export interface Buyer { name: string; type: string; }

export function lotCode(): string {
  const d = new Date();
  const ymd = `${d.getFullYear().toString().slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `FP-${ymd}-${Math.floor(100 + Math.random() * 900)}`;
}

export const SEED_LOTS: Lot[] = [
  { id: "l1", code: "FP-260918-204", date: "2026-09-18", species: "Boletus edulis", kg: 4.2, grade: "A", origin: "Hayedo del norte", buyer: "Ristorante Da Vittorio", pricePerKg: 38, status: "delivered" },
  { id: "l2", code: "FP-260921-512", date: "2026-09-21", species: "Cantharellus cibarius", kg: 2.6, grade: "A", origin: "Robledal del río", buyer: "Mercato di Como", pricePerKg: 26, status: "sold" },
  { id: "l3", code: "FP-260925-077", date: "2026-09-25", species: "Lactarius deliciosus", kg: 5.8, grade: "B", origin: "Pinar alto", buyer: "—", pricePerKg: 12, status: "harvested" },
];

export const SEED_BUYERS: Buyer[] = [
  { name: "Ristorante Da Vittorio", type: "Restaurante ·" },
  { name: "Mercato di Como", type: "Mercado" },
];
