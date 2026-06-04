import { NextRequest, NextResponse } from "next/server";
import { gbifOccurrences } from "@/lib/gbif";

export const runtime = "edge";

// GET /api/gbif?species=Boletus%20edulis&lat=45.9&lng=9.1&radius=25
// Proxy a GBIF: registros reales de avistamientos (global o cerca del punto).
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const species = sp.get("species");
  if (!species) return NextResponse.json({ error: "species requerido" }, { status: 400 });

  const lat = sp.get("lat") ? parseFloat(sp.get("lat")!) : undefined;
  const lng = sp.get("lng") ? parseFloat(sp.get("lng")!) : undefined;
  const radiusKm = sp.get("radius") ? parseFloat(sp.get("radius")!) : undefined;
  const limit = sp.get("limit") ? Math.min(300, parseInt(sp.get("limit")!) || 20) : undefined;

  try {
    const summary = await gbifOccurrences(species, { lat, lng, radiusKm, limit });
    return NextResponse.json(summary);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
