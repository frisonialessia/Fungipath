import { NextRequest, NextResponse } from "next/server";
import { getWeather } from "@/lib/openmeteo";

export const runtime = "edge";

// GET /api/forecast?lat=45.9&lng=9.18
// Previsión real a 7 días (Open-Meteo, gratis) para la vista Clima.
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const lat = parseFloat(sp.get("lat") || "");
  const lng = parseFloat(sp.get("lng") || "");
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json({ error: "lat y lng requeridos" }, { status: 400 });
  }
  try {
    const w = await getWeather(lat, lng);
    // los últimos 7 días del array son la previsión (forecast_days: 7)
    const daily = w.daily.slice(-7).map((d) => ({
      date: d.date,
      rain: Math.round(d.rain || 0),
      temp: Math.round(d.tempMean),
    }));
    return NextResponse.json({ daily, soilTemp: w.soilTemp, daysSinceRain: w.daysSinceRain });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
