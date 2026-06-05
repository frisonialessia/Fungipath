"use client";
import { useEffect, useRef } from "react";

// === Estilo del mapa (cambiar TILE para elegir; todos gratis, sin API key) ===
const TILES = {
  // Claro y minimal (CARTO Positron) — limpio y editorial.
  positron: { url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", sub: "abcd", attr: "© OpenStreetMap · © CARTO", max: 19 },
  // Claro con parques/bosques en verde y agua azul (CARTO Voyager).
  voyager: { url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png", sub: "abcd", attr: "© OpenStreetMap · © CARTO", max: 19 },
  // Topográfico con bosque verde y curvas de nivel (OpenTopoMap).
  topo: { url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", sub: "abc", attr: "© OpenTopoMap (CC-BY-SA)", max: 17 },
  // OpenStreetMap estándar (el de antes).
  osm: { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", sub: "abc", attr: "© OpenStreetMap", max: 18 },
};
const TILE = TILES.topo; // ← estilo activo (topográfico: bosque verde + curvas de nivel, forager pro)

export interface MapHotspot {
  id: string; name: string; species: string; prob: number;
  lat: number; lng: number; alt?: number;
}
export interface MapParcel {
  id: string; name: string; prob: number; points: [number, number][];
}

export default function FungiMap({
  hotspots, parcels = [], dots, center = [45.85, 9.15], zoom = 10,
  onSelect, onMapClick, drawMode = false, onParcelComplete, onSelectParcel,
}: {
  hotspots: MapHotspot[];
  parcels?: MapParcel[];
  dots?: { lat: number; lng: number }[];   // puntos de avistamientos (GBIF)
  center?: [number, number];
  zoom?: number;
  onSelect?: (id: string) => void;
  onMapClick?: (lat: number, lng: number) => void;
  drawMode?: boolean;
  onParcelComplete?: (points: [number, number][]) => void;
  onSelectParcel?: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);       // marcadores (pines)
  const parcelLayerRef = useRef<any>(null); // polígonos guardados
  const dotsLayerRef = useRef<any>(null);   // puntos de avistamientos
  const tempLayerRef = useRef<any>(null);   // dibujo en curso
  const LRef = useRef<any>(null);

  // refs vivas para callbacks/estado (sin re-bind de listeners)
  const drawRef = useRef(drawMode); drawRef.current = drawMode;
  const onMapClickRef = useRef(onMapClick); onMapClickRef.current = onMapClick;
  const onParcelCompleteRef = useRef(onParcelComplete); onParcelCompleteRef.current = onParcelComplete;
  const drawPtsRef = useRef<[number, number][]>([]);

  function redrawTemp() {
    const L = LRef.current; if (!L || !tempLayerRef.current) return;
    tempLayerRef.current.clearLayers();
    const pts = drawPtsRef.current;
    if (pts.length) {
      L.polyline(pts, { color: "#8b3f29", weight: 2, dashArray: "4 5" }).addTo(tempLayerRef.current);
      pts.forEach((p) => L.circleMarker(p, { radius: 4, color: "#8b3f29", fillColor: "#fff", fillOpacity: 1, weight: 2 }).addTo(tempLayerRef.current));
    }
  }
  function resetTemp() { drawPtsRef.current = []; if (tempLayerRef.current) tempLayerRef.current.clearLayers(); }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      LRef.current = L;
      if (cancelled || !ref.current) return;

      if (!mapRef.current) {
        mapRef.current = L.map(ref.current, { zoomControl: true, attributionControl: false }).setView(center, zoom);
        L.tileLayer(TILE.url, { maxZoom: TILE.max, subdomains: TILE.sub }).addTo(mapRef.current);
        L.control.attribution({ prefix: false, position: "bottomright" }).addAttribution(TILE.attr).addTo(mapRef.current);
        layerRef.current = L.layerGroup().addTo(mapRef.current);
        parcelLayerRef.current = L.layerGroup().addTo(mapRef.current);
        dotsLayerRef.current = L.layerGroup().addTo(mapRef.current);
        tempLayerRef.current = L.layerGroup().addTo(mapRef.current);

        mapRef.current.on("click", (e: any) => {
          const lat = +e.latlng.lat.toFixed(5), lng = +e.latlng.lng.toFixed(5);
          if (drawRef.current) { drawPtsRef.current = [...drawPtsRef.current, [lat, lng]]; redrawTemp(); }
          else onMapClickRef.current?.(lat, lng);
        });
        mapRef.current.on("dblclick", (e: any) => {
          if (!drawRef.current) return;
          e.originalEvent?.preventDefault?.();
          if (drawPtsRef.current.length >= 3) { onParcelCompleteRef.current?.(drawPtsRef.current); resetTemp(); }
        });
      } else {
        mapRef.current.setView(center, zoom);
      }

      // cursor + doble-clic-zoom según modo
      const container = mapRef.current.getContainer();
      container.classList.toggle("clickable", !!onMapClick || drawMode);
      if (drawMode) mapRef.current.doubleClickZoom.disable(); else mapRef.current.doubleClickZoom.enable();

      // pines
      layerRef.current.clearLayers();
      hotspots.forEach((h) => {
        const col = h.prob >= 80 ? "#8b3f29" : h.prob >= 55 ? "#a86543" : "#c08a5e";
        const icon = L.divIcon({ className: "", html: `<div class="lpin" style="background:${col}"><span>${h.prob}</span></div>`, iconSize: [34, 34], iconAnchor: [17, 34] });
        const m = L.marker([h.lat, h.lng], { icon }).addTo(layerRef.current);
        m.bindTooltip(`<b>${h.name}</b> · ${h.prob}%<br>${h.species}${h.alt ? " · " + h.alt + "m" : ""}`, { direction: "top", offset: [0, -30] });
        if (onSelect) m.on("click", () => onSelect(h.id));
      });

      // parcelas (polígonos)
      parcelLayerRef.current.clearLayers();
      parcels.forEach((p) => {
        const col = p.prob >= 80 ? "#8b3f29" : p.prob >= 55 ? "#a86543" : "#c08a5e";
        const poly = L.polygon(p.points, { color: col, weight: 2, fillColor: col, fillOpacity: 0.25 }).addTo(parcelLayerRef.current);
        if (onSelectParcel) poly.on("click", (ev: any) => { ev.originalEvent?.stopPropagation?.(); onSelectParcel(p.id); });
        const c = poly.getBounds().getCenter();
        const label = L.divIcon({ className: "", html: `<div class="parcel-label" style="border-color:${col}"><b>${p.prob}%</b> ${p.name}</div>`, iconSize: [0, 0] });
        L.marker(c, { icon: label, interactive: false }).addTo(parcelLayerRef.current);
      });

      // puntos de avistamientos reales (GBIF) en verde de marca
      dotsLayerRef.current.clearLayers();
      (dots || []).forEach((p) => {
        L.circleMarker([p.lat, p.lng], { radius: 4, color: "#0e9b3d", weight: 1, fillColor: "#52c871", fillOpacity: 0.7 }).addTo(dotsLayerRef.current);
      });
      if (dots && dots.length) {
        try { mapRef.current.fitBounds(L.latLngBounds(dots.map((p) => [p.lat, p.lng])), { padding: [22, 22], maxZoom: 5 }); } catch { /* noop */ }
      }
    })();
    return () => { cancelled = true; };
  }, [hotspots, parcels, dots, center, zoom, onSelect, onMapClick, drawMode, onSelectParcel]);

  // al salir del modo dibujo, limpia el trazo en curso
  useEffect(() => { if (!drawMode) resetTemp(); }, [drawMode]);

  return <div ref={ref} style={{ position: "absolute", inset: 0, borderRadius: 14 }} />;
}
