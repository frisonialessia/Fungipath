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
