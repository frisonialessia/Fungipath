"use client";
import { useState, type CSSProperties } from "react";

// Imagen de espécimen con fallback: si el PNG no carga, se oculta (no rompe nada).
export default function Specimen({ src, className, style, alt = "" }: { src: string; className?: string; style?: CSSProperties; alt?: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" decoding="async" draggable={false} className={className} style={style} onError={() => setOk(false)} />
  );
}
