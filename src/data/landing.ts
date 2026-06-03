// Herramientas de la landing, por público (recolector / aprendiz). Portado del prototipo.
export interface Tool { n: string; t: string; unique: boolean; }

export const TOOLS: Record<"collector" | "learner", Tool[]> = {
  collector: [
    { n: "Hotspot explicable", t: "Cada predicción con su porqué en lenguaje claro. Nunca una caja negra.", unique: false },
    { n: "Reloj de fructificación", t: "Cuenta los días desde la última lluvia útil. Sabes cuándo salir.", unique: false },
    { n: "Ruta óptima de jornada", t: "Ordena tus puntos por probabilidad, distancia y pendiente.", unique: true },
    { n: "Diario de cosecha", t: "Registra qué, cuánto y de dónde. Trazabilidad exportable.", unique: false },
    { n: "Registro de rendimiento", t: "Cuánto te dio cada sitio temporada a temporada.", unique: true },
    { n: "Alertas de ventana", t: "Aviso cuando tus zonas entran en óptimo. Llegas antes que nadie.", unique: false },
  ],
  learner: [
    { n: "Identificación guiada", t: "Te preguntamos láminas, corte, anillo y hábitat. Aprendes a observar.", unique: true },
    { n: "Comparador de sosias", t: "Cada comestible lado a lado con su gemelo tóxico.", unique: true },
    { n: "Esporada digital", t: "Cómo hacer un spore print paso a paso y qué significa cada color.", unique: false },
    { n: "Comestibilidad por región", t: "Una especie se come en Italia y se evita en Norteamérica. Lo mapeamos.", unique: true },
    { n: "Fichas de toxicidad", t: "Tipo de toxina, síntomas y ventana de aparición, con confianza.", unique: false },
    { n: "Agente guía del bosque", t: "Pregunta lo que quieras sobre predicciones, especies o rutas.", unique: true },
  ],
};
