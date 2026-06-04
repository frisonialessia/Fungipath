import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Datos REALES de suelo y terreno (gratis, sin API key):
// - ISRIC SoilGrids: pH, textura (arcilla/arena), carbono orgánico.
// - Open-Meteo Elevation: elevación + pendiente/orientación (de un mini-DEM).
// - Open-Meteo: humedad del suelo.
// Cada fuente es independiente; si una falla, devolvemos el resto.

function aspectLetter(deg: number): "N" | "E" | "S" | "O" {
  const a = ((deg % 360) + 360) % 360;
  if (a < 45 || a >= 315) return "N";
  if (a < 135) return "E";
  if (a < 225) return "S";
  return "O";
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const lat = parseFloat(sp.get("lat") || "");
  const lng = parseFloat(sp.get("lng") || "");
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json({ error: "lat y lng requeridos" }, { status: 400 });
  }

  const d = 0.0015; // ~165 m
  const out: Record<string, number | string | null> = {};

  // --- SoilGrids ---
  const soil = (async () => {
    const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lng}&lat=${lat}&property=phh2o&property=soc&property=clay&property=sand&depth=0-5cm&value=mean`;
    const r = await fetch(url, { next: { revalidate: 86400 } });
    if (!r.ok) throw new Error("soilgrids");
    const j = await r.json();
    const layers: { name: string; depths: { values: { mean: number | null } }[] }[] = j?.properties?.layers || [];
    const get = (name: string) => layers.find((l) => l.name === name)?.depths?.[0]?.values?.mean ?? null;
    const ph = get("phh2o"), clay = get("clay"), sand = get("sand"), soc = get("soc");
    if (ph != null) out.ph = +(ph / 10).toFixed(1);
    if (clay != null) out.clay = Math.round(clay / 10);
    if (sand != null) out.sand = Math.round(sand / 10);
    if (out.clay != null && out.sand != null) out.silt = Math.max(0, 100 - (out.clay as number) - (out.sand as number));
    if (soc != null) out.soc = +(soc / 10).toFixed(1); // g/kg
  })();

  // --- Elevación + pendiente/orientación (mini-DEM 5 puntos) ---
  const terrain = (async () => {
    const lats = [lat, lat + d, lat - d, lat, lat].join(",");
    const lngs = [lng, lng, lng, lng + d, lng - d].join(",");
    const r = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lats}&longitude=${lngs}`, { next: { revalidate: 86400 } });
    if (!r.ok) throw new Error("elev");
    const j = await r.json();
    const e: number[] = j.elevation || [];
    if (e.length >= 5) {
      out.elevation = Math.round(e[0]);
      const mPerDeg = 111320;
      const dy = (e[1] - e[2]) / (2 * d * mPerDeg);
      const dx = (e[3] - e[4]) / (2 * d * mPerDeg * Math.cos(lat * Math.PI / 180));
      const slope = Math.atan(Math.hypot(dx, dy)) * 180 / Math.PI;
      out.slope = +slope.toFixed(1);
      const aspDeg = (Math.atan2(-dx, -dy) * 180 / Math.PI + 360) % 360;
      out.aspectDeg = Math.round(aspDeg);
      out.aspect = slope < 1.5 ? "flat" : aspectLetter(aspDeg);
    }
  })();

  // --- Humedad del suelo (Open-Meteo) ---
  const moisture = (async () => {
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=soil_moisture_0_to_1cm&forecast_days=1`, { next: { revalidate: 3600 } });
    if (!r.ok) throw new Error("moist");
    const j = await r.json();
    const m: number[] = j?.hourly?.soil_moisture_0_to_1cm || [];
    const last = m.filter((x) => typeof x === "number").pop();
    if (last != null) out.moisture = Math.round(last * 100); // m3/m3 -> %
  })();

  await Promise.allSettled([soil, terrain, moisture]);
  out.configured = Object.keys(out).length > 0 ? "true" : "false";
  return NextResponse.json(out);
}
