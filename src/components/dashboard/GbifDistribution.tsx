"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useI18n } from "@/lib/i18n";
import { IconSpecimen } from "@/components/icons";

const FungiMap = dynamic(() => import("@/components/FungiMap"), { ssr: false });
interface Pt { lat: number; lng: number; }

// Mapa de distribución REAL de una especie con los avistamientos de GBIF.
export default function GbifDistribution({ species }: { species: string }) {
  const { t, locale } = useI18n();
  const [pts, setPts] = useState<Pt[] | null>(null);
  const [total, setTotal] = useState(0);
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    fetch(`/api/gbif?species=${encodeURIComponent(species)}&limit=120`)
      .then((r) => r.json())
      .then((d) => { if (cancelled) return; if (Array.isArray(d.points)) { setPts(d.points); setTotal(d.total || 0); setState("ok"); } else setState("err"); })
      .catch(() => { if (!cancelled) setState("err"); });
    return () => { cancelled = true; };
  }, [species]);

  const label = t("species.distribution");
  const fmt = (n: number) => n.toLocaleString(locale === "en" ? "en-US" : "es-ES");

  return (
    <div style={{ margin: "14px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px", color: "var(--terracotta)", marginBottom: 8 }}>
        <IconSpecimen size={14} /> {label}{state === "ok" && total ? ` · ${fmt(total)}` : ""}
      </div>
      <div style={{ position: "relative", height: 200, borderRadius: 12, overflow: "hidden", border: "1px solid var(--sand)", background: "#eef1e7" }}>
        {state === "loading" && <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "var(--stone)", fontSize: 12 }}>{t("gbif.loading")}</div>}
        {state === "err" && <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "var(--stone)", fontSize: 12 }}>{t("gbif.err")}</div>}
        {state === "ok" && pts && pts.length > 0 && <FungiMap hotspots={[]} dots={pts} center={[25, 5]} zoom={1} />}
        {state === "ok" && pts && pts.length === 0 && <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "var(--stone)", fontSize: 12 }}>{t("gbif.noneGlobal")}</div>}
      </div>
    </div>
  );
}
