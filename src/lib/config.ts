// Configuración central del PoC. Una sola fuente de verdad para saber qué hay
// "enchufado". Pensado como PLANTILLA: la demo funciona sin ninguna clave; quien
// forquee el repo solo tiene que añadir sus variables de entorno.
//
// Variables (todas OPCIONALES — ver .env.example):
//   NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY
//
// Nota: solo las variables NEXT_PUBLIC_* están disponibles en el cliente.

export const config = {
  // El agente "Guía del bosque" corre en LOCAL (reglas, sin coste, sin dependencias).
  // ¿Quieres un LLM real (Claude, OpenAI, …)? Cambia esto a "api" y conecta tu
  // endpoint en src/components/dashboard/ForestAgent.tsx (hay un comentario-guía).
  agentMode: "local" as "local" | "api",

  // Motor de datos: Supabase si está configurado; si no, datos mock locales.
  hasSupabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),

  // Datos en vivo SIN clave ni coste (se mantienen activos en la demo):
  //   Open-Meteo (clima), OpenStreetMap (mapa), GBIF (avistamientos).
  // Todos con fallback a mock si fallan.
  liveData: true,
} as const;

// ¿La app corre en "modo demo"? (agente local). Útil para el sello en la UI.
export const isDemoMode = config.agentMode === "local";
