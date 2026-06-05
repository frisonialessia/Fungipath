# CLAUDE.md — FungiPath

> Este archivo es el contexto maestro para Claude Code. Léelo entero antes de tocar nada.
> Empieza SIEMPRE por un análisis del funcionamiento actual (sección "Primera tarea") antes de escribir código.

---

## 1. Qué es FungiPath

FungiPath es una **SaaS de inteligencia forestal predictiva** para recolectores de hongos. En una frase: *"sabe dónde y cuándo brotará el bosque"*.

El producto cruza tres fuentes — **clima** (Open-Meteo), **terreno/satélite** (NDVI de Sentinel-2) y las **validaciones de campo del propio usuario** — para predecir la probabilidad de aparición de hongos de alto valor (Boletus, rebozuelos, níscalos, trufas…) en puntos concretos, y para enseñar a identificarlos sin riesgo.

### Dos tipos de usuario
1. **Recolector serio / semicomercial**: quiere maximizar hallazgos, optimizar rutas, llevar registro.
2. **Aficionado que aprende**: quiere identificar con seguridad, evitar especies tóxicas, entender el bosque.

### Principio de marca: lenguaje llano
Nada de jerga técnica en la interfaz. Se dice "91% de probabilidad de aparición" y "la ventana se abre en ~4 días", NO "citation score" ni "índice NDVI normalizado". Las explicaciones se dan en castellano natural.

### Los 4 diferenciadores (el corazón del producto)
- **F1 · Hotspot explicable**: cada predicción viene con su "por qué" en lenguaje llano (lluvia, temperatura, orientación de ladera).
- **F2 · Reloj de fructificación**: latencia tras la lluvia — cuándo se abre la ventana de recolección.
- **F3 · Diario que aprende**: las validaciones de campo del usuario recalibran el modelo. Este es el **foso defensivo**: cuantos más datos, mejor predice, y esos datos son propios.
- **F4 · Privacidad por diseño**: cada hotspot es privado / difuso / compartido a elección del usuario. Los puntos buenos no se filtran.

### Seguridad (innegociable)
La comestibilidad es asunto de vida o muerte. El producto **es educativo y NUNCA autoriza el consumo**. Siempre:
- Muestra los sosias (gemelos tóxicos) junto a cada comestible.
- Advierte de forma rotunda en especies tóxicas/mortales.
- Remite a confirmación con un micólogo o experto presencial.
El agente IA tiene estas reglas en su system prompt y no debe saltárselas nunca.

---

## 2. IMPORTANTE: esto es un PoC simulado

**Estamos en fase de prueba de concepto.** Trabaja con esta premisa:

- Los **datos son simulados o de demostración** por ahora. Los hotspots de ejemplo, las validaciones de campo, el rastreo GPS y el SOS usan datos mock. NO hace falta que todo sea real todavía.
- **Open-Meteo SÍ es real y gratis** (sin API key) — úsalo de verdad para el clima, ya está integrado en `src/lib/openmeteo.ts`.
- El **modelo de probabilidad es real** pero simplificado (gaussiano en `src/lib/model.ts`). No es ML entrenado todavía; es una heurística defendible. Está bien así para el PoC.
- Sentinel-2 / NDVI: **simulado** por ahora (valores de ejemplo). No integres la API real de Copernicus todavía.
- Auth, pagos, GPS de móvil, notificaciones push: **simulados o pendientes**. No los implementes salvo que se pida.

Cuando crees algo simulado, **márcalo claramente en el código** con un comentario `// MOCK (PoC):` para que luego sea fácil encontrar qué reemplazar por datos reales.

El objetivo del PoC es: **demostrar el flujo completo y convincente** (mapa real → predicción explicable con clima real → catálogo de especies → seguridad/agente) para enseñarlo a usuarios e inversores. No es producción.

---

## 3. Stack y arquitectura

- **Framework**: Next.js 14 (App Router) + TypeScript + Tailwind CSS.
- **Hosting**: Vercel.
- **BD**: Supabase (PostgreSQL + PostGIS + RLS). Esquema en `supabase/schema.sql`.
- **Mapas**: Leaflet + OpenStreetMap (gratis, sin API key).
- **Clima**: Open-Meteo (gratis, sin API key).
- **IA**: API de Claude (`@anthropic-ai/sdk`) para el agente "Guía del bosque".

### Estructura de carpetas
```
src/
  app/
    page.tsx              landing
    dashboard/page.tsx    dashboard (client component)
    api/
      predict/route.ts    GET — cruza Open-Meteo + modelo gaussiano → probabilidad
      agent/route.ts      POST — agente IA con Claude (reglas de seguridad)
  components/
    FungiMap.tsx          mapa Leaflet (import dinámico, sin SSR)
  lib/
    model.ts              modelo de probabilidad gaussiano + explicación
    openmeteo.ts          fetch de clima real
    supabase.ts           clientes (browser + admin server)
    species.ts            catálogo de especies + guías de campo
supabase/
  schema.sql              tablas, PostGIS, RLS, función calc_appearance_probability
```

### Variables de entorno (en `.env.local` y en Vercel)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
```

### El modelo (cómo funciona la predicción)
Gaussiano sobre dos variables, con bonus por orientación:
- óptimo de lluvia acumulada ≈ 45 mm
- óptimo de temperatura de suelo ≈ 15 °C
- ladera norte (retiene humedad) suma; ladera sur resta
Devuelve 8–97%. La misma fórmula existe en TS (`model.ts`) y en SQL (`calc_appearance_probability`) para coherencia. **Mantén ambas sincronizadas** si la cambias.

---

## 4. Estado actual (qué ya existe y funciona)

- ✅ Proyecto Next.js que compila y despliega en Vercel (build verificado).
- ✅ Landing con hero tipo producto.
- ✅ Dashboard con mapa Leaflet real + tarjeta de predicción que llama a `/api/predict`.
- ✅ `/api/predict` funcionando con Open-Meteo real.
- ✅ `/api/agent` con Claude (system prompt de seguridad).
- ✅ Esquema Supabase completo (PostGIS, RLS, función de probabilidad).
- ✅ Catálogo de ~12 especies con guías de campo en `species.ts`.

> Nota: existe además un **prototipo HTML monolítico** (`fungipath-app-v4.html`, fuera de este repo) mucho más rico en vistas (especies ilustradas, comparador de sosias, simulador, seguridad/SOS, modo offline, registro GPS, mapa topográfico). Sirve de **referencia de diseño y de features** a portar a este proyecto React. Pídelo al equipo si lo necesitas.

---

## 5. Convenciones de código

- **Idioma**: UI y comentarios en español. Nombres de variables/funciones en inglés o español, sé consistente dentro de cada archivo.
- **Paleta** (en `tailwind.config.ts`): marrones de marca — `cream #f1e7db`, `terracotta #a86543`, `clay #8b3f29`, `umber #6d482b`, `ink #2e231b`. Verdes SOLO para vegetación/mapa: `leaf #52c871`, `leaf2 #85df42`, `moss #0e9b3d`. No introduzcas colores fuera de esta paleta.
- **Tipografía**: Fraunces (serif, titulares e itálicas) + Hanken Grotesk (texto/UI).
- **Estética**: editorial, cartográfica, profesional. Pensar en "un guardia civil aficionado a la micología", no en una app infantil. Nada de ilustraciones de cuento ni blobs de acuarela.
- **Componentes de mapa**: SIEMPRE import dinámico con `ssr: false` (Leaflet no funciona en SSR).
- **Seguridad del agente**: nunca relajar las reglas del system prompt de `/api/agent`.
- **Marca los mocks** con `// MOCK (PoC):`.

---

## 6. PRIMERA TAREA (haz esto antes que nada)

1. **Analiza el funcionamiento actual**: recorre `src/`, lee `model.ts`, `openmeteo.ts`, las dos API routes, el dashboard y el esquema SQL. Escribe un resumen breve de cómo fluye una predicción de punta a punta (clic en pin → fetch clima → modelo → explicación → render).
2. **Verifica que el proyecto arranca**: `npm install` y `npm run dev`. Reporta cualquier error.
3. **Empieza a "conectar los motores"** en este orden, todo simulado/PoC:
   - **Motor de datos (Supabase)**: conecta el dashboard para que lea hotspots de Supabase en vez del array `DEMO` hardcodeado. Si no hay sesión/datos, cae a datos mock (con `// MOCK (PoC):`). Crea un seed con 5-6 hotspots de ejemplo en Lombardía.
   - **Motor de predicción**: haz que al cargar el dashboard se prediga en lote para todos los hotspots visibles (no solo al hacer clic), cacheando en la tabla `predictions`.
   - **Motor del agente**: conecta un chat flotante "Guía del bosque" en el dashboard que hable con `/api/agent`, pasándole como contexto los hotspots del usuario.
4. Tras cada motor conectado, deja una nota de qué quedó simulado y qué haría falta para hacerlo real.

No intentes hacer todo de golpe. Conecta un motor, verifica que funciona, y sigue.

---

## 7. Roadmap

### Fase 0 — PoC (AHORA)
- [x] Scaffold Next.js + deploy Vercel.
- [x] Predicción real con Open-Meteo + modelo gaussiano.
- [x] Mapa Leaflet real.
- [ ] Conectar dashboard a Supabase (con seed mock).
- [ ] Predicción en lote + cache en `predictions`.
- [ ] Chat del agente conectado en el dashboard.
- [ ] Portar del prototipo HTML: catálogo de especies ilustrado + comparador de sosias.

### Fase 1 — Producto mínimo usable
- [ ] **Auth de Supabase** (magic link). Hotspots por usuario con RLS real.
- [ ] CRUD de hotspots desde el mapa (crear pinchando, editar, borrar).
- [ ] **Diario de campo** persistente: registrar hallazgos (encontrado/vacío, kg, foto, GPS) que recalibran el modelo (F3).
- [ ] **Reloj de fructificación** real basado en `daysSinceRain` de Open-Meteo (F2).
- [ ] Controles de **privacidad** por hotspot: privado / difuso (coordenadas desplazadas) / compartido (F4).
- [ ] **Vercel Cron**: recálculo diario de predicciones para todos los hotspots.

### Fase 2 — Inteligencia y datos reales
- [ ] **NDVI real de Sentinel-2** (Copernicus) sustituyendo el mock de vegetación.
- [ ] **Modelo mejorado**: pasar del gaussiano a un modelo calibrado con las validaciones de campo acumuladas (el foso F3 en acción).
- [ ] Agente IA con contexto rico: que prediga, explique y dé tips de cosecha por especie dinámicamente.
- [ ] **Rutas óptimas**: dado el conjunto de hotspots, calcular la mejor jornada (mayor probabilidad, menor esfuerzo).
- [ ] Calendario de **vedas y permisos** por zona/región.

### Fase 3 — Móvil y campo
- [ ] **App móvil** (Expo/React Native) reusando estas API routes.
- [ ] **GPS real**, rastreo de ruta (migas de pan), **botón SOS** con coordenadas reales.
- [ ] **Modo offline**: descarga de mapas (tiles) y fichas para zonas sin cobertura.
- [ ] Registro fotográfico geolocalizado que alimenta el diario y el modelo.
- [ ] Notificaciones push: "tu hotspot X entra en ventana en 2 días".

### Fase 4 — Comunidad y negocio
- [ ] Actividad comunitaria anónima por comarca (sin revelar puntos exactos).
- [ ] Planes de suscripción (free / pro). Pasarela de pago.
- [ ] Expansión multi-región (el mapa ya contempla Europa, Norteamérica PNW, Japón…).

---

## 8. Cómo medir que vamos bien

El PoC tiene éxito si alguien que lo prueba entiende en 30 segundos: *"veo un mapa real de mi zona, veo dónde y por qué saldrán setas, y un guía me ayuda"*. Prioriza siempre la coherencia del flujo sobre el número de features.

---

**Aviso permanente**: FungiPath es educativo. No autoriza el consumo de setas. Toda identificación debe confirmarse con un experto presencial. El agente IA y la UI deben reflejar esto siempre.

---

## 9. Estado del PoC (actualizado · jun 2026)

> El roadmap detallado, la lista completa de features y la **guía de integración
> (cómo conectar Supabase / APIs / un modelo real)** viven ahora en el **README.md**.

**Filosofía:** la app funciona **sin backend, sin claves y sin coste** (guía local,
persistencia local, APIs gratis sin key con *fallback* a mock). Cada integración tiene
una **costura documentada** (`src/lib/config.ts` es la fuente de verdad de los flags).

**Construido (PoC, gratis):** dashboard de 15 secciones bilingüe/responsive; predicción
real (Open-Meteo) en lote; datos reales GBIF (registros + mapa de distribución) y
SoilGrids+DEM (suelo/terreno); identificación por foto (local, enchufable); mapa mundial
real; calendario + vedas/permisos; diario; modelo que aprende (F3, simulado); comunidad
con consenso (simulado); trazabilidad/ventas (CSV); ajustes.

**Planificado (sigue siendo gratis/sin backend):** persistencia local total, PWA offline
instalable, identificación guiada (clave dicotómica), optimizador de rutas + juego de
sosias, kit de difusión LinkedIn (Open Graph + tour).

**Producción (requiere infra/decisión):** auth Supabase multiusuario, modelo ML entrenado
con el diario (el foso F3), NDVI real Sentinel-2, app móvil (GPS/SOS/offline), planes+Stripe.
