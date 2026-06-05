import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FungiPath · Predictive forest intelligence",
    short_name: "FungiPath",
    description: "Know where and when the forest will bloom.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f6f1ea",
    theme_color: "#2e231b",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
