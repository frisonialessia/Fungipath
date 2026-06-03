// Modelo de probabilidad de aparición (gaussiano).
// Misma lógica que la función SQL calc_appearance_probability.
// óptimo: lluvia ~45mm acumulada, temp suelo ~15°C; bonus por orientación.

export type Aspect = "N" | "S" | "E" | "O";

export interface PredictInput {
  rainMm: number;      // lluvia acumulada reciente (mm)
  soilTemp: number;    // temperatura media del suelo (°C)
  aspect: Aspect;      // orientación de ladera
  species?: string;
}

export function calcProbability({ rainMm, soilTemp, aspect }: PredictInput): number {
  const rainScore = Math.exp(-Math.pow(rainMm - 45, 2) / (2 * Math.pow(22, 2)));
  const tempScore = Math.exp(-Math.pow(soilTemp - 15, 2) / (2 * Math.pow(5, 2)));
  const aspectBonus = aspect === "N" ? 1.05 : aspect === "E" ? 1.0 : aspect === "O" ? 0.98 : 0.9;
  return Math.max(8, Math.min(97, Math.round(rainScore * tempScore * 95 * aspectBonus)));
}

// Genera la explicación en lenguaje llano (sin jerga técnica).
export function buildExplanation(input: PredictInput, prob: number): string {
  const ladera = { N: "norte", S: "sur", E: "este", O: "oeste" }[input.aspect];
  const cond =
    prob >= 70 ? "Condiciones muy favorables." :
    prob >= 45 ? "Condiciones moderadas, vigila la evolución." :
    "Aún lejos del óptimo; necesita más lluvia o que suba la temperatura.";
  return `Con ${input.rainMm} mm de lluvia reciente y el suelo a ${input.soilTemp} °C en una ladera ${ladera}, el modelo estima un ${prob}% de probabilidad. ${cond}`;
}
