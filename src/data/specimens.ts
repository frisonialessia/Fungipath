// Especímenes fotográficos reales (PNG con transparencia) para la landing.
// Preparado para 15: si un archivo no existe, la celda se oculta (sin romper nada).
export const SPECIMENS = Array.from({ length: 15 }, (_, i) => `/landing/${String(i + 1).padStart(2, "0")}.png`);

// Acentos botánicos que flotan en el hero (composición tipo lámina).
export const HERO_SPECIMENS = ["/landing/09.png", "/landing/01.png", "/landing/04.png"];
