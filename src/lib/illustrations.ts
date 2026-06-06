// Ilustraciones SVG generativas por especie. Estética de lámina botánica:
// degradado en el sombrero, sombra de contacto en el suelo y luz superior.
import type { Species } from "./species";

const slug = (s: string) => "fg_" + s.replace(/[^a-z0-9]/gi, "").toLowerCase();

export function spIllust(sp: Species, size = 88): string {
  const w = size, h = Math.round(size * 1.36);
  const cap = sp.cap, cap2 = sp.cap2 || "#6d3a20", stem = sp.stem || "#e8dccd";
  const id = slug(sp.n);
  const CAP = `url(#${id})`;
  const STEM = `url(#${id}s)`;
  const sh = sp.shape;

  let g = `<defs>`
    + `<linearGradient id="${id}" x1="0" y1="0" x2="0.25" y2="1"><stop offset="0" stop-color="${cap}"/><stop offset="1" stop-color="${cap2}"/></linearGradient>`
    + `<radialGradient id="${id}s" cx="0.42" cy="0.4" r="0.7"><stop offset="0" stop-color="${stem}"/><stop offset="1" stop-color="#cbb89a"/></radialGradient>`
    + `</defs>`;
  // sombra de contacto en el suelo
  g += `<ellipse cx="44" cy="115" rx="25" ry="4.6" fill="#2e231b" opacity="0.14"/>`;

  if (sh === "bolete") {
    g += `<path d="M22 60 C20 80 20 92 24 100 C28 106 36 108 44 108 C52 108 60 106 64 100 C68 92 68 80 66 60 C54 64 34 64 22 60 Z" fill="${STEM}" stroke="#c9b79c" stroke-width="1"/>`;
    g += `<path d="M14 56 C14 30 28 14 44 14 C60 14 74 30 74 56 C74 64 60 68 44 68 C28 68 14 64 14 56 Z" fill="${CAP}"/>`;
    g += `<ellipse cx="32" cy="30" rx="13" ry="7" fill="#fff" opacity=".18"/>`;
  } else if (sh === "amanita") {
    g += `<path d="M34 56 C32 78 32 94 36 102 C40 108 48 110 44 110 L52 110 C56 110 56 108 52 102 C56 94 56 78 54 56 Z" fill="${STEM}" stroke="#c9b79c" stroke-width="1"/>`;
    g += `<ellipse cx="44" cy="108" rx="14" ry="5" fill="${STEM}" stroke="#c9b79c" stroke-width="1"/>`;
    g += `<path d="M12 50 C12 26 26 12 44 12 C62 12 76 26 76 50 C76 58 62 62 44 62 C26 62 12 58 12 50 Z" fill="${CAP}"/>`;
    g += `<ellipse cx="30" cy="28" rx="12" ry="6" fill="#fff" opacity=".16"/>`;
    if (sp.dots !== false) { const pts = [[24,30],[34,22],[44,18],[54,22],[64,30],[30,42],[44,38],[58,42],[38,50],[50,50]]; pts.forEach(p => { g += `<circle cx="${p[0]}" cy="${p[1]}" r="2.5" fill="#f4ecdd"/>`; }); }
  } else if (sh === "chanterelle") {
    g += `<path d="M16 30 Q44 16 72 30 Q66 44 58 90 Q52 102 44 102 Q36 102 30 90 Q22 44 16 30 Z" fill="${CAP}"/>`;
    g += `<path d="M22 40 Q44 50 66 40 M30 60 Q44 66 58 60 M34 78 Q44 82 54 78" fill="none" stroke="${cap2}" stroke-width="1.3" opacity=".5"/>`;
    g += `<ellipse cx="34" cy="30" rx="10" ry="5" fill="#fff" opacity=".16"/>`;
  } else if (sh === "morel") {
    g += `<path d="M37 70 C36 84 36 96 38 104 Q44 108 50 104 C52 96 52 84 51 70 Z" fill="${STEM}" stroke="#c9b79c" stroke-width="1"/>`;
    g += `<path d="M28 64 Q26 14 44 11 Q62 14 60 64 Q44 74 28 64 Z" fill="${CAP}"/>`;
    let al = ""; for (let y = 18; y < 62; y += 9) { for (let x = 32; x < 58; x += 8) { al += `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="4.2" fill="none" stroke="${cap2}" stroke-width="1.2" opacity=".7"/>`; } }
    g += al;
  } else if (sh === "oyster") {
    g += `<path d="M14 52 Q14 26 50 26 Q84 28 78 48 Q70 66 44 66 Q22 66 14 52 Z" fill="${CAP}"/>`;
    let ln = ""; for (let a = 22; a < 78; a += 6) { ln += `<line x1="46" y1="62" x2="${a}" y2="32" stroke="${cap2}" stroke-width="1" opacity=".4"/>`; }
    g += ln + `<ellipse cx="40" cy="36" rx="12" ry="5" fill="#fff" opacity=".15"/>`;
  } else if (sh === "parasol") {
    g += `<path d="M40 52 C39 78 38 94 40 104 Q44 108 48 104 C50 94 49 78 48 52 Z" fill="${STEM}" stroke="#c9b79c" stroke-width="1"/>`;
    g += `<ellipse cx="44" cy="52" rx="7" ry="3" fill="${cap2}"/>`;
    g += `<path d="M16 48 Q16 20 44 18 Q72 20 72 48 Q58 56 44 56 Q30 56 16 48 Z" fill="${CAP}"/>`;
    const sc = [[26,28],[36,24],[50,24],[60,28],[32,38],[44,34],[56,38],[38,46],[50,46]]; sc.forEach(p => { g += `<circle cx="${p[0]}" cy="${p[1]}" r="2" fill="${cap2}"/>`; });
    g += `<circle cx="44" cy="20" r="4" fill="${cap2}"/>`;
  } else if (sh === "puffball") {
    g += `<ellipse cx="44" cy="64" rx="34" ry="32" fill="${CAP}"/><ellipse cx="34" cy="50" rx="12" ry="9" fill="#fff" opacity=".14"/>`;
  } else if (sh === "trumpet") {
    g += `<path d="M20 24 Q44 14 68 24 Q60 60 50 96 Q46 104 44 104 Q42 104 38 96 Q28 60 20 24 Z" fill="${CAP}"/>`;
    g += `<ellipse cx="44" cy="24" rx="24" ry="8" fill="${cap2}"/>`;
    g += `<ellipse cx="44" cy="24" rx="14" ry="4.5" fill="#2e231b"/>`;
  } else if (sh === "coral") {
    g += `<path d="M44 108 L44 70" stroke="${STEM}" stroke-width="8" stroke-linecap="round"/>`;
    const br = [[44,70,30,30],[44,70,58,28],[44,72,24,46],[44,72,64,44],[44,74,38,20],[44,74,52,18]]; br.forEach(b => { g += `<path d="M${b[0]} ${b[1]} Q${(b[0]+b[2])/2} ${b[1]-26} ${b[2]} ${b[3]}" fill="none" stroke="${CAP}" stroke-width="6" stroke-linecap="round"/>`; });
  }
  return `<svg viewBox="0 0 88 120" width="${w}" height="${h}">${g}</svg>`;
}

// Icono mini para listas: reusa spIllust si encuentra la especie, fallback a un hongo genérico.
export function mushIcon(species: string, all: Species[], color = "#ffa143"): string {
  const sp = all.find(s => species && s.n.split(" ")[0] === species.split(" ")[0]);
  if (sp) return spIllust(sp, 30);
  return `<svg viewBox="0 0 24 24"><path d="M3 11 C3 7 7 4 12 4 C17 4 21 7 21 11 C21 12.5 17 13 12 13 C7 13 3 12.5 3 11 Z" fill="${color}"/><path d="M9 13 C8.5 17 8.5 19 9 21 Q12 22 15 21 C15.5 19 15.5 17 15 13 Z" fill="#d6c4ac"/></svg>`;
}
