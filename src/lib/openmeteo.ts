// Open-Meteo · clima gratis, sin API key.
// Devuelve lluvia acumulada y temperatura de suelo recientes para unas coordenadas.

export interface WeatherSummary {
  rainMm: number;       // lluvia acumulada últimos 10 días
  soilTemp: number;     // temperatura media de suelo reciente (°C)
  daysSinceRain: number;
  elevation: number;    // elevación real del terreno (m), de Open-Meteo
  daily: { date: string; rain: number; tempMean: number }[];
}

export async function getWeather(lat: number, lng: number): Promise<WeatherSummary> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    daily: "precipitation_sum,temperature_2m_mean",
    hourly: "soil_temperature_6cm",
    past_days: "14",
    forecast_days: "7",
    timezone: "auto",
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("Open-Meteo error " + res.status);
  const data = await res.json();

  const dates: string[] = data.daily.time;
  const rain: number[] = data.daily.precipitation_sum;
  const temp: number[] = data.daily.temperature_2m_mean;

  // lluvia acumulada de los últimos 10 días disponibles hasta hoy
  const recentRain = rain.slice(-17, -7).reduce((a, b) => a + (b || 0), 0);

  // días desde la última lluvia útil (>5mm)
  let daysSinceRain = 0;
  for (let i = rain.length - 8; i >= 0; i--) {
    if ((rain[i] || 0) > 5) break;
    daysSinceRain++;
  }

  // temperatura de suelo media reciente
  const soil: number[] = data.hourly?.soil_temperature_6cm || [];
  const soilTemp = soil.length
    ? +(soil.slice(-72).reduce((a, b) => a + (b || 0), 0) / Math.min(72, soil.length)).toFixed(1)
    : +(temp.slice(-3).reduce((a, b) => a + b, 0) / 3).toFixed(1);

  const daily = dates.map((d, i) => ({ date: d, rain: rain[i], tempMean: temp[i] }));

  // Open-Meteo devuelve la elevación real del terreno para esas coordenadas.
  const elevation = typeof data.elevation === "number" ? Math.round(data.elevation) : 0;

  return { rainMm: Math.round(recentRain), soilTemp, daysSinceRain, elevation, daily };
}
