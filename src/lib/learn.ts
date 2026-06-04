// "Modelo que aprende" (F3) — SIMULADO, 100% local, sin APIs ni coste.
// Las validaciones de campo del diario recalibran la predicción: el foso defensivo.
import type { DiaryEntry } from "@/data/hotspots";

export interface Calibration { delta: number; found: number; total: number; }

// Ajuste por hotspot a partir de su historial en el diario (tasa de acierto).
export function hotspotCalibration(name: string, diary: DiaryEntry[]): Calibration {
  const e = diary.filter((d) => d.spot === name);
  if (!e.length) return { delta: 0, found: 0, total: 0 };
  const found = e.filter((d) => d.found).length;
  const hit = found / e.length;
  // +/- 12 puntos según se desvíe del 50%
  const delta = Math.round((hit - 0.5) * 24);
  return { delta, found, total: e.length };
}

// Precisión del modelo (simulada): mejora con cada validación de campo.
export function modelAccuracy(validations: number): number {
  return Math.min(94, 68 + validations * 2);
}

// Serie de precisión a lo largo de las validaciones (para la curva de aprendizaje).
export function accuracyCurve(validations: number): number[] {
  const n = Math.max(6, validations);
  return Array.from({ length: n + 1 }, (_, i) => modelAccuracy(i));
}
