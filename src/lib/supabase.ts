import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente para el navegador (respeta RLS con la sesión del usuario)
export const supabase = createClient(url, anon);

// Cliente de servidor con service role (solo en API routes / server).
// NUNCA lo importes en componentes de cliente.
export function supabaseAdmin() {
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, service, { auth: { persistSession: false } });
}
