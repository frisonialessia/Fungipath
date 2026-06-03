"use client";
import { useEffect, useState } from "react";

interface Summary { total: number; lastYear: number | null; }

// Muestra registros reales de GBIF para una especie (global o cerca de un punto).
// variant "chip": píldora oscura para el panel del mapa. variant "line": línea para la ficha.
export default function GbifBadge({
  species, lat, lng, radius, variant = "chip",
}: {
  species: string; lat?: number; lng?: number; radius?: number; variant?: "chip" | "line";
}) {
  const [data, setData] = useState<Summary | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    const qs = new URLSearchParams({ species });
    if (lat != null && lng != null) { qs.set("lat", String(lat)); qs.set("lng", String(lng)); if (radius) qs.set("radius", String(radius)); }
    fetch(`/api/gbif?${qs}`)
      .then((r) => r.json())
      .then((d) => { if (cancelled) return; if (typeof d.total === "number") { setData(d); setState("ok"); } else setState("err"); })
      .catch(() => { if (!cancelled) setState("err"); });
    return () => { cancelled = true; };
  }, [species, lat, lng, radius]);

  const near = lat != null && lng != null;
  const fmt = (n: number) => n.toLocaleString("es-ES");

  let text: string;
  if (state === "loading") text = "Consultando registros reales (GBIF)…";
  else if (state === "err") text = "Registros GBIF no disponibles ahora";
  else if (!data || data.total === 0) text = near ? `Sin avistamientos GBIF en ${radius ?? 25} km` : "Sin registros en GBIF";
  else text = near
    ? `${fmt(data.total)} avistamientos en ${radius ?? 25} km${data.lastYear ? ` · último ${data.lastYear}` : ""}`
    : `${fmt(data.total)} observaciones mundiales${data.lastYear ? ` · último registro ${data.lastYear}` : ""}`;

  if (variant === "line") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--ink-soft)", marginTop: 10 }}>
        <span aria-hidden>🔬</span>
        <span><b>GBIF:</b> {text}</span>
      </div>
    );
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 11, color: "#cabdac", background: "rgba(255,255,255,.07)", borderRadius: 8, padding: "6px 10px" }}>
      <span aria-hidden>🔬</span>{text}
    </span>
  );
}
