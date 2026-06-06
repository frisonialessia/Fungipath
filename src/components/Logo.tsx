// Marca de FungiPath = el favicon (cuadro ink + arco lima + esporas). Mismo glifo en todo el producto.
export default function Logo({ size = 30 }: { size?: number; fill?: string }) {
  return (
    <svg viewBox="0 0 120 120" style={{ width: size, height: size, display: "block" }} aria-label="FungiPath">
      <rect width="120" height="120" rx="28" fill="#241a12" />
      <path d="M24 72 A36 36 0 0 1 96 72 Z" fill="#9cd147" />
      <g fill="#52c871"><circle cx="44" cy="94" r="6" /><circle cx="60" cy="103" r="6.5" /><circle cx="76" cy="94" r="6" /></g>
    </svg>
  );
}
