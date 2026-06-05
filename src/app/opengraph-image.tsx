import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FungiPath — Predictive forest intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen de previsualización (LinkedIn/redes), generada al vuelo. Sin coste, sin libs.
export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f6f1ea", padding: 72, fontFamily: "Georgia, serif" }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#8b3f29", fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 18 }}>
            <div style={{ width: 26, height: 2, background: "#8b3f29", display: "flex" }} />
            Predictive forest intelligence
          </div>
          <div style={{ fontSize: 96, fontWeight: 800, color: "#2e231b", lineHeight: 1, marginBottom: 18, display: "flex" }}>FungiPath</div>
          <div style={{ fontSize: 38, color: "#8b3f29", lineHeight: 1.15, maxWidth: 620, display: "flex" }}>Know where and when the forest will bloom.</div>
          <div style={{ fontSize: 20, color: "#9c9283", marginTop: 34, display: "flex" }}>Open-Meteo · GBIF · SoilGrids · OpenStreetMap</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 320 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 260, height: 260, background: "#2e231b", borderRadius: 40 }}>
            <div style={{ fontSize: 110, fontWeight: 800, color: "#c2724b", lineHeight: 1, display: "flex" }}>91%</div>
            <div style={{ fontSize: 20, color: "#cabdac", letterSpacing: 1, marginTop: 8, display: "flex" }}>appearance prob.</div>
          </div>
          <div style={{ fontSize: 22, color: "#6d482b", marginTop: 22, fontStyle: "italic", display: "flex" }}>Boletus edulis · ~4 days</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
