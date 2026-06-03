"use client";
import { useEffect, useRef } from "react";

export interface MapHotspot {
  id: string; name: string; species: string; prob: number;
  lat: number; lng: number; alt?: number;
}

export default function FungiMap({
  hotspots, center = [45.85, 9.15], zoom = 10, onSelect, onMapClick,
}: {
  hotspots: MapHotspot[];
  center?: [number, number];
  zoom?: number;
  onSelect?: (id: string) => void;
  onMapClick?: (lat: number, lng: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  // ref viva para el callback de clic (evita re-bind del listener en cada render)
  const clickRef = useRef(onMapClick);
  clickRef.current = onMapClick;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current) return;

      if (!mapRef.current) {
        mapRef.current = L.map(ref.current, { zoomControl: true, attributionControl: false }).setView(center, zoom);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18 }).addTo(mapRef.current);
        L.control.attribution({ prefix: false, position: "bottomright" })
          .addAttribution("© OpenStreetMap").addTo(mapRef.current);
        layerRef.current = L.layerGroup().addTo(mapRef.current);
        // crear hotspot pinchando el mapa (coordenadas reales)
        mapRef.current.on("click", (e: { latlng: { lat: number; lng: number } }) => {
          clickRef.current?.(+e.latlng.lat.toFixed(5), +e.latlng.lng.toFixed(5));
        });
      } else {
        // recentra al cambiar de región
        mapRef.current.setView(center, zoom);
      }

      // cursor de cruz cuando se puede crear pinchando
      const container = mapRef.current.getContainer();
      container.classList.toggle("clickable", !!onMapClick);

      layerRef.current.clearLayers();
      hotspots.forEach((h) => {
        const col = h.prob >= 80 ? "#8b3f29" : h.prob >= 55 ? "#a86543" : "#c08a5e";
        const icon = L.divIcon({
          className: "",
          html: `<div class="lpin" style="background:${col}"><span>${h.prob}</span></div>`,
          iconSize: [34, 34], iconAnchor: [17, 34],
        });
        const m = L.marker([h.lat, h.lng], { icon }).addTo(layerRef.current);
        m.bindTooltip(`<b>${h.name}</b> · ${h.prob}%<br>${h.species}${h.alt ? " · " + h.alt + "m" : ""}`, { direction: "top", offset: [0, -30] });
        if (onSelect) m.on("click", (ev: { originalEvent?: Event }) => { ev.originalEvent && (ev as any).originalEvent.stopPropagation?.(); onSelect(h.id); });
      });
    })();
    return () => { cancelled = true; };
  }, [hotspots, center, zoom, onSelect, onMapClick]);

  return <div ref={ref} style={{ position: "absolute", inset: 0, borderRadius: 14 }} />;
}
