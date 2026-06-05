# 🍄 FungiPath

**Predictive forest intelligence** — knows *where and when* the forest will bloom. A
proof-of-concept SaaS that crosses live weather, terrain and real biodiversity records
to predict high-value mushroom appearance, teaches safe identification, and gives a
professional forager the full toolkit (field, season/legality, traceability, community).

> **Built as a clean, fork-ready template.** It runs end-to-end with **zero config,
> zero cost and no required backend** — local "AI" guide, local persistence, free
> no-key data APIs (with mock fallback). Add your own keys, a database or a real model
> when you want: every integration sits behind an **obvious, documented seam**.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind · Leaflet/OpenStreetMap ·
Open-Meteo · GBIF · ISRIC SoilGrids. Bilingual (EN/ES) and fully responsive.

---

## Run it locally

```bash
npm install
npm run dev          # http://localhost:3000
```

No keys required. You get the full landing + a 15-section dashboard.

---

## What's inside (dashboard)

**Exploration:** Hotspot map (real Leaflet, draw parcels, click-to-create) · Predictions ·
Learning model (F3) · Species (24 illustrated + look-alike comparator + real GBIF
distribution) · Identify (photo) · World foraging map · Community (consensus + districts).
**Data:** Weather (7-day) · Soil & terrain (pH/texture/slope) · Season & rules
(calendar + permits) · Harvest journal · Trail safety · Privacy.
**Business:** Traceability & sales (lots → buyer, CSV export).
**Account:** Settings (profile, alerts, favorites).

---

## What's real vs simulated, and how to make it "yours"

Everything degrades gracefully: if an API/DB isn't there, the app falls back to local
mock data and keeps working. **One source of truth:** [`src/lib/config.ts`](src/lib/config.ts).

| Capability | Default (PoC) | Seam to plug your own |
|---|---|---|
| **Weather** | ✅ Live free (Open-Meteo, no key) | `src/lib/openmeteo.ts`, `/api/predict*`, `/api/forecast` |
| **Map tiles** | ✅ Live free (CARTO/OSM) | `TILE` const in `src/components/FungiMap.tsx` |
| **Species records / distribution** | ✅ Live free (GBIF, no key) | `src/lib/gbif.ts`, `/api/gbif` |
| **Soil & terrain** | ✅ Live free (SoilGrids + DEM) | `/api/soil` |
| **Probability model** | ✅ Real gaussian heuristic | `src/lib/model.ts` (TS) + `supabase/schema.sql` (SQL) |
| **Learning loop (F3)** | 🟡 Simulated, local | `src/lib/learn.ts` — replace with a trained model |
| **AI guide** | 🟡 Local rules (free) | `agentMode` in `config.ts` + `ForestAgent.tsx` |
| **Photo ID** | 🟡 Local color match (free) | `/api/identify` (documented seam for a vision model) |
| **Persistence / accounts** | 🟡 Local (localStorage) | `/api/hotspots` + `src/lib/supabase.ts` |
| **Community** | 🟡 Simulated, local | `src/data/community.ts` |

---

## 🔌 Integration guide (plug a database or real APIs)

The PoC is intentionally backend-free. To take it to production:

### Supabase (auth + persistence)
1. Create a Supabase project. In the SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql)
   (includes the auth-based `hotspots`/`predictions`/`field_logs` schema with RLS **and**
   an isolated public `demo_hotspots` table + seed for a no-auth PoC).
2. Set env vars (see `.env.example`): `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
3. The data engine at [`src/app/api/hotspots/route.ts`](src/app/api/hotspots/route.ts)
   already reads/writes Supabase when configured (mock fallback otherwise). `config.hasSupabase`
   flips automatically. Add magic-link auth with `supabase.auth` and switch the dashboard
   to load per-user rows.

### A real LLM for the guide
Set `agentMode: "api"` in `src/lib/config.ts`, call your endpoint from
`src/components/dashboard/ForestAgent.tsx`, keep the local guide (`src/lib/forestGuide.ts`)
as fallback. Hard safety rules must stay.

### A real vision model for photo ID
Wire it in [`src/app/api/identify/route.ts`](src/app/api/identify/route.ts) (the seam is
marked). On success return `{ species, confidence, … }`; the UI already renders it and
always shows toxic look-alikes + the safety disclaimer.

### Real NDVI / land cover
Add a Sentinel-2 / Copernicus or ESA WorldCover call alongside `/api/soil`.

---

## 🗺️ Roadmap

**Done (PoC, free):**
- [x] Landing + 15-section dashboard, bilingual (EN/ES), responsive, branded.
- [x] Real prediction (Open-Meteo + gaussian), batch on load, fruiting clock.
- [x] Real data: GBIF (records + distribution map), SoilGrids + DEM (soil/terrain), elevation.
- [x] Photo identification (local, pluggable), look-alike comparator.
- [x] World foraging map (real Leaflet, famous regions, live probability).
- [x] Season calendar + foraging rules/permits by region.
- [x] Harvest journal, learning model (F3, simulated), community + consensus (simulated).
- [x] Traceability & sales (lots → buyer, CSV export). Settings/profile.
- [x] Fork-ready: free, no-key, mock fallback everywhere; config seams.

**Planned (still free / no backend):**
- [ ] Full local persistence (localStorage) — the app remembers everything.
- [ ] PWA: installable + offline (service worker + manifest).
- [ ] Guided identification (dichotomous key: gills/ring/volva/cut).
- [ ] Real route optimizer (distance/elevation/probability) + look-alike training game.
- [ ] LinkedIn share kit: Open Graph image + guided demo tour.
- [ ] Field guides (spore print, chemical tests), expanded catalog.

**Production (needs infra / decisions):**
- [ ] Supabase auth + per-user data (multi-user).
- [ ] Trained ML model calibrated on accumulated field validations (the F3 moat).
- [ ] Real NDVI (Sentinel-2/Copernicus).
- [ ] Mobile app (Expo): real GPS, breadcrumb tracking, SOS, offline tiles.
- [ ] Plans (Free/Pro/Team) + Stripe; public API; DNA/lab integration (premium).

---

## Project structure

```
src/
  app/                 landing, dashboard, api/ (predict, forecast, gbif, soil, hotspots, identify)
  components/
    FungiMap.tsx       Leaflet map (tiles config, pins, parcels, dots, draw)
    dashboard/         sidebar + 15 section components + agent + modals
    landing/           landing islands
  lib/
    config.ts          feature flags (one source of truth)
    model.ts learn.ts forestGuide.ts   prediction, learning loop, local guide
    openmeteo.ts gbif.ts   free live data sources
    species.ts illustrations.ts        bilingual catalog (24) + generative SVG
    i18n.tsx locale.ts messages.ts     internationalization (EN/ES)
  data/                mock hotspots, zones, foraging, regulations, business, community
supabase/schema.sql    demo table + seed + full auth schema (RLS, PostGIS)
```

---

**Safety notice.** FungiPath is **educational** and **never authorizes mushroom
consumption**. Always confirm any identification with an in-person expert. The guide and
UI enforce this everywhere.
