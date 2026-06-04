// "Guía del bosque" LOCAL (sin LLM, sin coste, sin claves). Motor de respuestas
// por reglas, bilingüe, que razona sobre los hotspots del usuario y el catálogo.
// Respeta SIEMPRE las reglas de seguridad: nunca autoriza el consumo.
//
// ¿Quieres un LLM real? No borres esto: úsalo como fallback. Conecta tu endpoint
// en ForestAgent.tsx y deja esta función para cuando no haya API configurada.
import { SPECIES } from "./species";
import { tx, type Locale } from "./locale";

export interface GuideHotspot { name: string; species: string; prob: number; why: string; alt: number; aspect: string; }

const DISCLAIMER = {
  en: "FungiPath is educational and never authorizes eating mushrooms. Always confirm any find with a local expert.",
  es: "FungiPath es educativo y nunca autoriza el consumo. Confirma siempre cualquier hallazgo con un experto local.",
};

export function forestGuideReply(qRaw: string, hotspots: GuideHotspot[], locale: Locale): string {
  const q = qRaw.toLowerCase();
  const en = locale === "en";
  const top = [...hotspots].sort((a, b) => b.prob - a.prob)[0];

  const has = (...words: string[]) => words.some((w) => q.includes(w));

  // ¿Dónde voy / ruta / mañana?
  if (has("dónde", "donde", "where", "mañana", "tomorrow", "ruta", "route", "go")) {
    if (!top) return en ? "Add a hotspot first and I'll tell you where to head." : "Marca un hotspot primero y te diré dónde ir.";
    return en
      ? `Your best bet right now is ${top.name} (${top.prob}% for ${top.species}). ${top.why} For several points in one day, check Best routes.\n\n${DISCLAIMER.en}`
      : `Tu mejor apuesta ahora es ${top.name} (${top.prob}% para ${top.species}). ${top.why} Para varios puntos en una jornada, mira Rutas óptimas.\n\n${DISCLAIMER.es}`;
  }

  // ¿Por qué X% / un hotspot concreto?
  const byName = hotspots.find((h) => {
    const parts = h.name.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    return parts.some((p) => q.includes(p)) || q.includes(h.species.toLowerCase().split(" ")[0]);
  });
  if (byName && has("por qué", "porque", "why", "%", "prob")) {
    return en
      ? `${byName.name} is at ${byName.prob}% because ${byName.why}`
      : `${byName.name} está al ${byName.prob}% porque ${byName.why}`;
  }

  // Especie / comestibilidad
  const sp = SPECIES.find((s) =>
    q.includes(s.n.toLowerCase().split(" ")[0]) ||
    q.includes(tx(s.com, "es").toLowerCase().split(" ")[0]) ||
    q.includes(tx(s.com, "en").toLowerCase().split(" ")[0])
  );
  if (sp) {
    const verdict = en
      ? { deadly: "is DEADLY — never eat it", toxic: "is toxic, do not eat", choice: "is a choice edible", edible: "is edible", caution: "needs caution" }[sp.edib]
      : { deadly: "es MORTAL — nunca la consumas", toxic: "es tóxica, no consumir", choice: "es un comestible excelente", edible: "es comestible", caution: "requiere precaución" }[sp.edib];
    return en
      ? `${sp.n} (${tx(sp.com, "en")}) ${verdict}. ${tx(sp.note, "en")} It grows in ${tx(sp.hab, "en").toLowerCase()}, in ${tx(sp.season, "en").toLowerCase()}. Possible confusion: ${tx(sp.twin, "en")}.\n\n${DISCLAIMER.en}`
      : `${sp.n} (${tx(sp.com, "es")}) ${verdict}. ${tx(sp.note, "es")} Crece en ${tx(sp.hab, "es").toLowerCase()}, en ${tx(sp.season, "es").toLowerCase()}. Posible confusión: ${tx(sp.twin, "es")}.\n\n${DISCLAIMER.es}`;
  }

  // Identificar
  if (has("identif", "qué hongo", "what mushroom", "recogn", "reconoc")) {
    return en
      ? "To identify safely I need to look with you: what color are the gills? Does the cut change color? Is there a ring or volva at the base? Where was it growing (tree, soil)? Tell me and we'll go step by step.\n\nNo chat identification replaces a mycologist's check."
      : "Para identificar con seguridad necesito observar contigo: ¿de qué color son las láminas? ¿El corte cambia de color? ¿Tiene anillo o volva en la base? ¿Dónde crecía (árbol, suelo)? Cuéntame y vamos paso a paso.\n\nNinguna identificación por chat sustituye a un micólogo.";
  }

  // Clima
  if (has("clima", "lluvia", "tiempo", "weather", "rain")) {
    return en
      ? "Soil humidity is around 82% (optimal) and the last useful rain was ~9 days ago. Check Weather for the 7-day detail and the simulator."
      : "La humedad del suelo ronda el 82% (óptima) y la última lluvia útil fue hace ~9 días. Mira Clima para el detalle a 7 días y el simulador.";
  }

  // Por defecto
  return en
    ? "I can help with: predictions (why a spot is active), species (ID & edibility), routes (where to go) and weather. Which one?"
    : "Puedo ayudarte con: predicciones (por qué un sitio está activo), especies (identificación y comestibilidad), rutas (dónde ir) y clima. ¿Sobre cuál?";
}
