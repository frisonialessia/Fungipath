import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// Motor de datos (Supabase). Si no hay env configurado, devuelve configured:false
// y el dashboard cae a los datos mock — sin romper nada (PoC).
function env() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { url, anon, service };
}

// GET — lista los hotspots de demostración desde Supabase.
export async function GET() {
  const { url, anon } = env();
  if (!url || !anon) return NextResponse.json({ configured: false, hotspots: [] });
  try {
    const sb = createClient(url, anon, { auth: { persistSession: false } });
    const { data, error } = await sb
      .from("demo_hotspots")
      .select("id,name,species,altitude,aspect,habitat,lat,lng,privacy")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ configured: true, hotspots: data ?? [] });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ configured: false, hotspots: [], error: msg });
  }
}

// POST — persiste un hotspot nuevo (service role, evita RLS). Best-effort.
export async function POST(req: NextRequest) {
  const { url, service } = env();
  if (!url || !service) return NextResponse.json({ saved: false, configured: false });
  try {
    const b = await req.json();
    const sb = createClient(url, service, { auth: { persistSession: false } });
    const { data, error } = await sb.from("demo_hotspots").insert({
      name: b.name, species: b.species, altitude: b.altitude ?? null,
      aspect: b.aspect, habitat: b.habitat ?? null, lat: b.lat, lng: b.lng,
      privacy: b.privacy ?? "private",
    }).select("id").single();
    if (error) throw error;
    return NextResponse.json({ saved: true, id: data.id });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ saved: false, error: msg }, { status: 200 });
  }
}
