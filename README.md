# 🍄 FungiPath

**Predictive forest intelligence** — knows *where and when* the forest will bloom. A
proof-of-concept SaaS that crosses live weather, terrain and real biodiversity records
to predict high-value mushroom appearance, and teaches safe identification.

> **Built as a clean, fork-ready template.** It runs end-to-end with **zero config and
> zero cost** (local AI guide + mock data + free no-key APIs). Add your own keys or
> database when you want — each integration sits behind an obvious seam.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind · Leaflet/OpenStreetMap ·
Open-Meteo · GBIF · optional Supabase. Bilingual (EN/ES) and fully responsive.

---

## Run it locally

```bash
npm install
npm run dev          # http://localhost:3000
```

That's it — **no keys required**. You get the full landing + dashboard (9 views),
the illustrated species catalog, the live weather predictions and the local AI guide.

---

## What's live vs. mock (and how to swap it)

| Capability | Default in the PoC | How to make it "yours" |
|---|---|---|
| **Weather** (Open-Meteo) | ✅ Live, free, no key | Already real. Edit `src/lib/openmeteo.ts`. |
| **Map** (OpenStreetMap) | ✅ Live, free, no key | `src/components/FungiMap.tsx`. |
| **Species records** (GBIF) | ✅ Live, free, no key | `src/lib/gbif.ts` + `/api/gbif`. |
| **Probability model** | ✅ Real (gaussian heuristic) | `src/lib/model.ts`. |
| **AI guide** | 🟡 Local rules (free, no key) | Set `agentMode: "api"` in `src/lib/config.ts` and wire your LLM in `ForestAgent.tsx`. |
| **Hotspots / persistence** | 🟡 Mock (in-memory) | Add Supabase env vars → reads/writes `demo_hotspots`. |

Everything degrades gracefully: if an API or the database isn't there, the app falls
back to mock data and keeps working.

### Single source of truth
`src/lib/config.ts` exposes the feature flags (`hasSupabase`, `agentMode`, …) derived
from env vars. The dashboard shows a subtle **"demo"** badge when the guide runs locally.

---

## Optional: enable persistence with Supabase

1. In the Supabase **SQL Editor**, run the `demo_hotspots` block from
   [`supabase/schema.sql`](supabase/schema.sql) (an isolated, public-read demo table +
   a seed of 6 hotspots — it doesn't touch anything else).
2. Copy `.env.example` → `.env.local` (or set the vars in Vercel) and fill:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
3. Redeploy. The badge becomes `… · Supabase` and hotspots are read/persisted for real.

> The full auth-based schema (RLS per user, PostGIS, prediction cache) is also in
> `supabase/schema.sql` for when you move beyond the PoC.

## Optional: plug a real LLM into the guide

The "Forest guide" runs locally by default (`src/lib/forestGuide.ts` — bilingual,
rule-based, with hard safety rules: it never authorizes eating a mushroom). To use a
real model: set `agentMode: "api"` in `src/lib/config.ts`, call your endpoint from
`src/components/dashboard/ForestAgent.tsx`, and keep the local guide as the fallback.

---

## Project structure

```
src/
  app/
    page.tsx                landing (client, i18n)
    dashboard/page.tsx      dashboard shell
    api/
      predict/ , predict/batch/   Open-Meteo + model (single & batch)
      gbif/                       GBIF proxy (real occurrence records)
      hotspots/                   Supabase data engine (GET/POST, mock fallback)
  components/
    FungiMap.tsx            Leaflet map (dynamic, ssr:false)
    dashboard/              sidebar + 9 sections + ForestAgent + modals
    landing/                landing islands
    icons.tsx, Logo.tsx, LangToggle.tsx
  lib/
    config.ts               feature flags (one source of truth)
    model.ts                probability model (+ bilingual explanation)
    openmeteo.ts, gbif.ts   free live data sources
    forestGuide.ts          local AI guide (no key, no cost)
    species.ts              bilingual catalog (24 species) + field guides
    i18n.tsx, locale.ts, messages.ts   internationalization (EN/ES)
  data/                     mock hotspots, zones, regions
supabase/schema.sql         demo table + seed + full auth schema
```

---

## Deploy

Push to GitHub and import in **Vercel** (auto-detects Next.js). Add env vars only if
you want Supabase/LLM; otherwise it deploys and runs as a free demo.

---

**Safety notice.** FungiPath is **educational** and **never authorizes mushroom
consumption**. Always confirm any identification with an in-person expert. The AI guide
and UI enforce this everywhere.
