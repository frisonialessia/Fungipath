"use client";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import ForestAgent from "@/components/dashboard/ForestAgent";

// Guía del bosque en la landing: misma burbuja, modo informativo (sin hotspots del usuario).
export default function LandingGuide() {
  const { locale } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <ForestAgent hotspots={[]} locale={locale} open={open} setOpen={setOpen} pendingAsk={null} onAsked={() => {}} />
  );
}
