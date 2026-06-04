import { NextResponse } from "next/server";

export const runtime = "edge";

// COSTURA para identificación por foto con un MODELO DE VISIÓN real.
// Por defecto (demo) devolvemos configured:false y el cliente usa una
// coincidencia visual local (por color) — gratis, sin clave, sin coste.
//
// Para precisión real, aquí enchufas tu visión (p. ej. Claude Vision, GPT-4o
// vision, o un clasificador propio): recibe la imagen en base64, la analizas y
// devuelves { species, common, confidence, edibility, lookalike, note }.
// Mantén SIEMPRE las reglas de seguridad: nunca autorizar el consumo, mostrar
// los sosias tóxicos y remitir a un experto.
export async function POST() {
  return NextResponse.json({ configured: false });
}
