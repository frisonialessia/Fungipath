"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { IconSpecimen } from "@/components/icons";

interface Summary { total: number; lastYear: number | null; }

// Muestra registros reales de GBIF para una especie (global o cerca de un punto).
export default function GbifBadge({
  species, lat, lng, radius, variant = "chip",
}: {
  species: string; lat?: number; lng?: number; radius?: number; variant?: "chip" | "line";
}) {
  const { t, locale } = useI18n();
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
  const r = radius ?? 25;
  const fmt = (n: number) => n.toLocaleString(locale === "en" ? "en-US" : "es-ES");

  let text: string;
  if (state === "loading") text = t("gbif.loading");
  else if (state === "err") text = t("gbif.err");
  else if (!data || data.total === 0) text = near ? t("gbif.noneNear", { r }) : t("gbif.noneGlobal");
  else {
    const last = data.lastYear ? (near ? t("gbif.lastNear", { y: data.lastYear }) : t("gbif.lastGlobal", { y: data.lastYear })) : "";
    text = (near ? t("gbif.near", { n: fmt(data.total), r }) : t("gbif.global", { n: fmt(data.total) })) + last;
  }

  if (variant === "line") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--ink-soft)", marginTop: 10 }}>
        <IconSpecimen size={15} style={{ color: "var(--terracotta)", flexShrink: 0 }} />
        <span><b>GBIF:</b> {text}</span>
      </div>
    );
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 12, fontSize: 11, color: "#cabdac", background: "rgba(255,255,255,.07)", borderRadius: 8, padding: "6px 10px" }}>
      <IconSpecimen size={14} style={{ flexShrink: 0 }} />{text}
    </span>
  );
}
