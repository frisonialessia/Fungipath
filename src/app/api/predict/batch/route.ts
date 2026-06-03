import { NextRequest, NextResponse } from "next/server";
import { getWeather } from "@/lib/openmeteo";
import { calcProbability, buildExplanation, Aspect } from "@/lib/model";

export const runtime = "edge";

// POST /api/predict/batch
// body: { points: [{ lat, lng, aspect, species }] }
// Cruza Open-Meteo (clima real) + modelo gaussiano para TODOS los puntos en paralelo.
// Devuelve { results: [...] } en el mismo orden; null en los que fallen (offline / rate limit).
export async function POST(req: NextRequest) {
  try {
    const { points } = await req.json();
    if (!Array.isArray(points)) {
      return NextResponse.json({ error: "points[] requerido" }, { status: 400 });
    }

    const results = await Promise.all(
      points.map(async (p: { lat: number; lng: number; aspect?: Aspect; species?: string }) => {
        try {
          const aspect = (p.aspect || "N") as Aspect;
          const weather = await getWeather(p.lat, p.lng);
          const input = { rainMm: weather.rainMm, soilTemp: weather.soilTemp, aspect, species: p.species };
          const probability = calcProbability(input);
          const explanation = buildExplanation(input, probability);
          // ventana de fructificación: pico aprox. a los 10-14 días tras la lluvia útil
          const windowDays = Math.max(0, 13 - weather.daysSinceRain);
          return {
            probability,
            explanation,
            windowDays,
            elevation: weather.elevation,
            factors: {
              rainMm: weather.rainMm,
              soilTemp: weather.soilTemp,
              daysSinceRain: weather.daysSinceRain,
              aspect,
            },
          };
        } catch {
          return null; // un punto que falla no tumba el lote
        }
      })
    );

    return NextResponse.json({ results });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
