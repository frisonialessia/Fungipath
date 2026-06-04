// Set de iconos de línea (editorial, trazo fino, currentColor).
// Reemplazan los emojis del prototipo para una estética de SaaS seria.
import type { CSSProperties } from "react";

type P = { size?: number; className?: string; style?: CSSProperties; stroke?: number };
const base = (size = 18) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none" as const });

export function IconSun({ size, className, style, stroke = 1.6 }: P) {
  return <svg {...base(size)} className={className} style={style} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" /></svg>;
}
export function IconCloud({ size, className, style, stroke = 1.6 }: P) {
  return <svg {...base(size)} className={className} style={style} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.3A3.5 3.5 0 0 1 17.5 18H7Z" /></svg>;
}
export function IconCloudSun({ size, className, style, stroke = 1.6 }: P) {
  return <svg {...base(size)} className={className} style={style} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><path d="M8 6.5V5M5 8H3.5M12.5 8L11 9.5M4.5 4.5L6 6M8 11a3 3 0 0 0 2.9-3.8" /><path d="M7.5 19a3.5 3.5 0 0 1-.3-7 4.3 4.3 0 0 1 8.2-1.1A3.2 3.2 0 0 1 17 19H7.5Z" /></svg>;
}
export function IconRain({ size, className, style, stroke = 1.6 }: P) {
  return <svg {...base(size)} className={className} style={style} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><path d="M7 15a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.3A3.5 3.5 0 0 1 17.5 15H7Z" /><path d="M8 18l-1 2M12 18l-1 2M16 18l-1 2" /></svg>;
}
export function weatherIcon(kind: string, p?: P) {
  if (kind === "sun") return <IconSun {...p} />;
  if (kind === "rain") return <IconRain {...p} />;
  if (kind === "cloud-sun") return <IconCloudSun {...p} />;
  return <IconCloud {...p} />;
}

export function IconBroadleaf({ size, className, style, stroke = 1.6 }: P) {
  return <svg {...base(size)} className={className} style={style} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><path d="M12 21v-7" /><path d="M12 14c-4 0-7-2.5-7-6 0 0 3-.5 5 1 0-3 2-6 2-6s2 3 2 6c2-1.5 5-1 5-1 0 3.5-3 6-7 6Z" /></svg>;
}
export function IconConifer({ size, className, style, stroke = 1.6 }: P) {
  return <svg {...base(size)} className={className} style={style} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><path d="M12 21v-3" /><path d="M12 3 8 9h2.5L7 14h4l-1 4h4l-1-4h4l-3.5-5H16L12 3Z" /></svg>;
}
export function IconAcorn({ size, className, style, stroke = 1.6 }: P) {
  return <svg {...base(size)} className={className} style={style} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9h12M7 9a5 5 0 0 0 10 0M12 3v2" /><path d="M8.5 9c0 0-1 3 0 6s3 4 3.5 4 2.5-1 3.5-4 0-6 0-6" /></svg>;
}
export function IconOakLeaf({ size, className, style, stroke = 1.6 }: P) {
  return <svg {...base(size)} className={className} style={style} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V8" /><path d="M12 8c-1.5-3-5-3-5-3 .5 2-1 3-1 3 2 .5 2 2 2 2-2 0-3 1.5-3 1.5 1.5 1.5 4 1 4 1M12 8c1.5-3 5-3 5-3-.5 2 1 3 1 3-2 .5-2 2-2 2 2 0 3 1.5 3 1.5-1.5 1.5-4 1-4 1" /></svg>;
}
export function IconBirch({ size, className, style, stroke = 1.6 }: P) {
  return <svg {...base(size)} className={className} style={style} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><path d="M9 21l1.5-9M15 21l-1.5-9" /><path d="M12 12c-3 0-5-2-5-5l5-4 5 4c0 3-2 5-5 5Z" /></svg>;
}
export function treeIcon(kind: string, p?: P) {
  if (kind === "conifer") return <IconConifer {...p} />;
  if (kind === "acorn") return <IconAcorn {...p} />;
  if (kind === "oak") return <IconOakLeaf {...p} />;
  if (kind === "birch") return <IconBirch {...p} />;
  return <IconBroadleaf {...p} />;
}

// "Dato verificado" — usado en GBIF (registros reales).
export function IconSpecimen({ size, className, style, stroke = 1.6 }: P) {
  return <svg {...base(size)} className={className} style={style} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><circle cx="10.5" cy="10.5" r="5.5" /><path d="M14.5 14.5 20 20" /><path d="M8.5 10.5l1.5 1.5 3-3" /></svg>;
}
export function IconPlay({ size, className, style, stroke = 1.6 }: P) {
  return <svg {...base(size)} className={className} style={style} stroke="currentColor" strokeWidth={stroke} strokeLinejoin="round"><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg>;
}
export function IconStop({ size, className, style, stroke = 1.6 }: P) {
  return <svg {...base(size)} className={className} style={style} stroke="currentColor" strokeWidth={stroke} strokeLinejoin="round"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>;
}
export function IconPin({ size, className, style, stroke = 1.6 }: P) {
  return <svg {...base(size)} className={className} style={style} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}
export function IconCompass({ size, className, style, stroke = 1.6 }: P) {
  return <svg {...base(size)} className={className} style={style} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5 5-2Z" /></svg>;
}
export function IconShare({ size, className, style, stroke = 1.6 }: P) {
  return <svg {...base(size)} className={className} style={style} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="12" r="2.5" /><circle cx="17" cy="6" r="2.5" /><circle cx="17" cy="18" r="2.5" /><path d="M8.2 10.8 14.8 7.2M8.2 13.2l6.6 3.6" /></svg>;
}
export function IconBasket({ size, className, style, stroke = 1.6 }: P) {
  return <svg {...base(size)} className={className} style={style} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><path d="M4 9h16l-1.5 10.5a1.5 1.5 0 0 1-1.5 1.5H7a1.5 1.5 0 0 1-1.5-1.5L4 9Z" /><path d="M8.5 9 12 3l3.5 6M9 13v4M15 13v4" /></svg>;
}
export function IconParcel({ size, className, style, stroke = 1.6 }: P) {
  return <svg {...base(size)} className={className} style={style} stroke="currentColor" strokeWidth={stroke} strokeLinejoin="round"><path d="M4 8 L9 4 L15 6 L20 5 L19 16 L13 20 L7 18 L4 19 Z" /><circle cx="9" cy="4" r="1.3" fill="currentColor" /><circle cx="20" cy="5" r="1.3" fill="currentColor" /><circle cx="13" cy="20" r="1.3" fill="currentColor" /><circle cx="4" cy="19" r="1.3" fill="currentColor" /></svg>;
}
export function IconLens({ size, className, style, stroke = 1.6 }: P) {
  return <svg {...base(size)} className={className} style={style} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="6" /><path d="M15.5 15.5 20 20" /></svg>;
}
