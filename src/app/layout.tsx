import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "FungiPath · Predictive forest intelligence",
  description: "Know where and when the forest will bloom. Mushroom prediction crossing weather, satellite and your terrain.",
  metadataBase: new URL("https://fungipath.vercel.app"),
  openGraph: {
    title: "FungiPath · Predictive forest intelligence",
    description: "Know where and when the forest will bloom — predict mushrooms with weather, terrain and biodiversity data.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "FungiPath", description: "Know where and when the forest will bloom." },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,900;1,9..144,500&family=Hanken+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
