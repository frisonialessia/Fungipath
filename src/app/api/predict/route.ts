import { NextRequest, NextResponse } from "next/server";
import { getWeather } from "@/lib/openmeteo";
import { calcProbability, buildExplanation, Aspect } from "@/lib/model";

export const runtime = "edge";

// GET /api/predict?lat=45.9&lng=9.18&aspect=N&species=Boletus%20edulis
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const lat = parseFloat(sp.get("lat") || "");
  const lng = parseFloat(sp.get("lng") || "");
  const aspect = (sp.get("aspect") || "N") as Aspect;
  const species = sp.get("species") || undefined;

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json({ error: "lat y lng requeridos" }, { status: 400 });
  }

  try {
    const weather = await getWeather(lat, lng);
    const input = { rainMm: weather.rainMm, soilTemp: weather.soilTemp, aspect, species };
    const probability = calcProbability(input);
    const explanation = buildExplanation(input, probability);

    // ventana de fructificación: tras lluvia útil, pico aprox. a los 10-14 días
    const windowDays = Math.max(0, 13 - weather.daysSinceRain);

    return NextResponse.json({
      probability,
      explanation,
      windowDays,
      factors: {
        rainMm: weather.rainMm,
        soilTemp: weather.soilTemp,
        daysSinceRain: weather.daysSinceRain,
        aspect,
      },
      forecast: weather.daily,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
