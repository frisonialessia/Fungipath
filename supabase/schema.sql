-- ============================================================
-- FungiPath · Esquema de base de datos (Supabase / PostgreSQL)
-- Ejecuta esto en el SQL Editor de tu proyecto Supabase.
-- ============================================================

-- Extensiones
create extension if not exists postgis;

-- ---------- HOTSPOTS ----------
create table if not exists hotspots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  species text not null,
  altitude int,
  aspect text check (aspect in ('N','S','E','O')),
  habitat text,
  geom geography(Point, 4326) not null,
  privacy text default 'private' check (privacy in ('private','fuzzy','shared')),
  created_at timestamptz default now()
);
create index if not exists hotspots_geom_idx on hotspots using gist (geom);
create index if not exists hotspots_user_idx on hotspots (user_id);

-- ---------- CLIMA DIARIO (cache de Open-Meteo) ----------
create table if not exists weather_daily (
  id bigserial primary key,
  hotspot_id uuid references hotspots(id) on delete cascade,
  date date not null,
  rain_mm numeric,
  temp_mean numeric,
  soil_temp numeric,
  soil_moisture numeric,
  unique (hotspot_id, date)
);

-- ---------- PREDICCIONES ----------
create table if not exists predictions (
  id bigserial primary key,
  hotspot_id uuid references hotspots(id) on delete cascade,
  date date not null,
  probability int,
  explanation text,
  factors jsonb,
  created_at timestamptz default now(),
  unique (hotspot_id, date)
);

-- ---------- DIARIO DE CAMPO (validaciones que entrenan el modelo) ----------
create table if not exists field_logs (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  hotspot_id uuid references hotspots(id) on delete cascade,
  found boolean not null,
  weight_kg numeric,
  notes text,
  photo_url text,
  geom geography(Point, 4326),
  logged_at timestamptz default now()
);

-- ============================================================
-- FUNCIÓN DE PROBABILIDAD (modelo gaussiano)
-- óptimo: lluvia ~45mm, temp suelo ~15°C; bonus por ladera norte
-- ============================================================
create or replace function calc_appearance_probability(
  rain_mm numeric, soil_temp numeric, aspect text
) returns int as $$
declare
  rain_score numeric;
  temp_score numeric;
  aspect_bonus numeric;
begin
  rain_score := exp(-power(rain_mm - 45, 2) / (2 * power(22, 2)));
  temp_score := exp(-power(soil_temp - 15, 2) / (2 * power(5, 2)));
  aspect_bonus := case aspect
    when 'N' then 1.05 when 'E' then 1.0 when 'O' then 0.98 else 0.9 end;
  return greatest(8, least(97, round(rain_score * temp_score * 95 * aspect_bonus)));
end;
$$ language plpgsql immutable;

-- ============================================================
-- RLS · cada usuario solo ve y edita lo suyo (+ hotspots 'shared')
-- ============================================================
alter table hotspots enable row level security;
alter table field_logs enable row level security;
alter table predictions enable row level security;
alter table weather_daily enable row level security;

create policy "ver hotspots propios o compartidos" on hotspots
  for select using (auth.uid() = user_id or privacy = 'shared');
create policy "insertar hotspots propios" on hotspots
  for insert with check (auth.uid() = user_id);
create policy "editar hotspots propios" on hotspots
  for update using (auth.uid() = user_id);
create policy "borrar hotspots propios" on hotspots
  for delete using (auth.uid() = user_id);

create policy "field_logs propios" on field_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "predicciones de hotspots visibles" on predictions
  for select using (exists (
    select 1 from hotspots h where h.id = predictions.hotspot_id
      and (h.user_id = auth.uid() or h.privacy = 'shared')
  ));

create policy "weather de hotspots visibles" on weather_daily
  for select using (exists (
    select 1 from hotspots h where h.id = weather_daily.hotspot_id
      and (h.user_id = auth.uid() or h.privacy = 'shared')
  ));

-- ---------- BÚSQUEDA POR RADIO (hotspots cercanos) ----------
create or replace function hotspots_near(lat float, lng float, radius_m int)
returns setof hotspots as $$
  select * from hotspots
  where st_dwithin(geom, st_makepoint(lng, lat)::geography, radius_m);
$$ language sql stable;

-- ============================================================
-- DEMO (PoC) · tabla aislada para la prueba de concepto SIN auth.
-- Lectura pública (anon) para enseñar el flujo. Las inserciones se hacen
-- desde el servidor con service_role. Sin PostGIS: lat/lng simples.
-- Cuando haya auth real, migrar a la tabla `hotspots` de arriba.
-- ============================================================
create table if not exists demo_hotspots (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  species text not null,
  altitude int,
  aspect text check (aspect in ('N','S','E','O')),
  habitat text,
  lat double precision not null,
  lng double precision not null,
  privacy text default 'private' check (privacy in ('private','fuzzy','shared')),
  created_at timestamptz default now()
);
create index if not exists demo_hotspots_created_idx on demo_hotspots (created_at);

alter table demo_hotspots enable row level security;
-- Lectura pública para el PoC (no hay datos sensibles, son de demostración).
drop policy if exists "demo read" on demo_hotspots;
create policy "demo read" on demo_hotspots for select using (true);

-- Seed: 6 hotspots de ejemplo en Lombardía (idempotente).
insert into demo_hotspots (name, species, altitude, aspect, habitat, lat, lng, privacy)
select * from (values
  ('North beech wood',   'Boletus edulis',         920,  'N', 'Beech wood',     45.92, 9.18, 'private'),
  ('Riverside oak wood', 'Cantharellus cibarius',  640,  'E', 'Oak wood',       45.78, 9.32, 'fuzzy'),
  ('High pine wood',     'Lactarius deliciosus',   1150, 'O', 'Pine wood',      46.05, 9.45, 'private'),
  ('South holm-oak wood','Amanita caesarea',       480,  'S', 'Holm-oak wood',  45.70, 9.05, 'private'),
  ('Old chestnut wood',  'Boletus edulis',         780,  'N', 'Chestnut wood',  45.85, 9.55, 'shared'),
  ('Valtellina larch',   'Boletus pinophilus',     1320, 'N', 'Larch wood',     46.17, 9.87, 'private')
) as v(name, species, altitude, aspect, habitat, lat, lng, privacy)
where not exists (select 1 from demo_hotspots);

