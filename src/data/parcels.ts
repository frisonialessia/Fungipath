// Parcelas dibujadas en el mapa (polígonos con información). PoC en memoria.
import type { Aspect } from "./hotspots";

export interface Parcel {
  id: string;
  name: string;
  species: string;
  notes?: string;
  points: [number, number][];   // vértices [lat, lng]
  lat: number; lng: number;     // centroide
  aspect: Aspect;
  prob: number;
  why: string;
  live?: boolean;
  rainMm?: number; soilTemp?: number; daysSinceRain?: number; windowDays?: number;
}

export function centroid(points: [number, number][]): [number, number] {
  const n = points.length || 1;
  const s = points.reduce((a, p) => [a[0] + p[0], a[1] + p[1]] as [number, number], [0, 0]);
  return [+(s[0] / n).toFixed(5), +(s[1] / n).toFixed(5)];
}

// Área aproximada en hectáreas (fórmula del cordón sobre coords, suficiente para PoC).
export function areaHa(points: [number, number][]): number {
  if (points.length < 3) return 0;
  const R = 6378137; // m
  const rad = (d: number) => (d * Math.PI) / 180;
  let a = 0;
  for (let i = 0; i < points.length; i++) {
    const [lat1, lng1] = points[i];
    const [lat2, lng2] = points[(i + 1) % points.length];
    a += rad(lng2 - lng1) * (2 + Math.sin(rad(lat1)) + Math.sin(rad(lat2)));
  }
  const m2 = Math.abs((a * R * R) / 2);
  return +(m2 / 10000).toFixed(1);
}
