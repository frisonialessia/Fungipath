// GBIF · Global Biodiversity Information Facility (gratis, sin API key).
// Registros REALES de avistamientos de especies. Da credibilidad científica:
// "no es una predicción inventada, hay N observaciones confirmadas en la zona".
// https://www.gbif.org/developer/occurrence

export interface GbifPoint { lat: number; lng: number; year: number | null; }
export interface GbifSummary {
  total: number;          // nº de registros que cumplen el filtro
  lastYear: number | null; // año del registro más reciente encontrado
  points: GbifPoint[];     // coordenadas reales de los registros (distribución)
}

// Cuenta registros de una especie, opcionalmente cerca de unas coordenadas.
export async function gbifOccurrences(
  scientificName: string,
  opts?: { lat?: number; lng?: number; radiusKm?: number; limit?: number }
): Promise<GbifSummary> {
  const params = new URLSearchParams({
    scientificName,
    hasCoordinate: "true",
    limit: String(opts?.limit ?? 20),
  });
  // GBIF acepta geoDistance "lat,lng,distancia" (p. ej. 45.9,9.1,25km)
  if (opts?.lat != null && opts?.lng != null) {
    params.set("geoDistance", `${opts.lat},${opts.lng},${opts.radiusKm ?? 25}km`);
  }
  const url = `https://api.gbif.org/v1/occurrence/search?${params}`;
  const res = await fetch(url, { next: { revalidate: 86400 } }); // cache 24h
  if (!res.ok) throw new Error("GBIF error " + res.status);
  const data = await res.json();

  const results: { year?: number; decimalLatitude?: number; decimalLongitude?: number }[] = data.results || [];
  const years = results.map((r) => r.year).filter((y): y is number => typeof y === "number");
  const lastYear = years.length ? Math.max(...years) : null;
  const points: GbifPoint[] = results
    .filter((r) => typeof r.decimalLatitude === "number" && typeof r.decimalLongitude === "number")
    .map((r) => ({ lat: r.decimalLatitude as number, lng: r.decimalLongitude as number, year: r.year ?? null }));

  return { total: typeof data.count === "number" ? data.count : 0, lastYear, points };
}
