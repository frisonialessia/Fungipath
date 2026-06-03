# 🍄 FungiPath

Inteligencia forestal predictiva: predice dónde y cuándo aparecerán hongos de alto valor cruzando clima (Open-Meteo), terreno y validaciones de campo. Stack: **Next.js 14 + TypeScript + Tailwind + Supabase + Leaflet + Claude API**.

## Qué incluye este proyecto

- **Landing** (`/`) y **dashboard** (`/dashboard`) con mapa real de OpenStreetMap vía Leaflet.
- **API `/api/predict`**: cruza clima en vivo de Open-Meteo con el modelo de probabilidad gaussiano.
- **API `/api/agent`**: el agente "Guía del bosque" con la API de Claude (con reglas de seguridad).
- **Supabase**: esquema con PostGIS, RLS, la función `calc_appearance_probability` y búsqueda por radio.
- **Modelo** (`src/lib/model.ts`): óptimo lluvia ~45mm, temp suelo ~15°C, bonus por ladera.

## Puesta en marcha local

```bash
npm install
cp .env.example .env.local   # rellena tus claves
npm run dev                  # http://localhost:3000
```

## Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor**, pega y ejecuta `supabase/schema.sql`.
3. En **Project Settings → API**, copia `URL`, `anon key` y `service_role key` a tu `.env.local`.

## Configurar Claude

1. Consigue una API key en [console.anthropic.com](https://console.anthropic.com).
2. Ponla en `ANTHROPIC_API_KEY`.

## Desplegar en Vercel

1. Sube el proyecto a un repo de GitHub:
   ```bash
   git init && git add . && git commit -m "FungiPath inicial"
   git remote add origin <tu-repo> && git push -u origin main
   ```
2. En [vercel.com](https://vercel.com) → **New Project** → importa el repo.
3. En **Environment Variables**, añade las mismas 4 claves del `.env.example`.
4. **Deploy**. Vercel detecta Next.js automáticamente.

> Las API routes usan `runtime = "edge"` para arrancar rápido. Open-Meteo es gratis y sin clave.

## Variables de entorno

| Variable | Dónde |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (¡secreta!) |
| `ANTHROPIC_API_KEY` | console.anthropic.com |

## Próximos pasos sugeridos

- Auth de Supabase (magic link) para hotspots por usuario.
- Job programado (Vercel Cron) que recalcule predicciones diarias.
- Sentinel-2 NDVI para el dato de vegetación real.
- App móvil (Expo) reusando las API routes para GPS, SOS y modo offline.

---

**Aviso:** FungiPath es educativo. **No autoriza el consumo de setas.** Identifica siempre con un experto presencial.
