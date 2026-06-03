import Link from "next/link";

const Logo = () => (
  <svg viewBox="0 0 120 130" style={{ width: 30, height: 32 }}>
    <g fill="#a86543">
      <path d="M60 12 C57 12 54 14 50 19 C40 31 30 46 26 55 C24 59 24 62 28 64 C33 66 42 66 49 65 C52 65 50 68 49 70 C52 68 55 67 58 67 L62 67 C65 67 68 68 71 70 C70 68 68 65 71 65 C78 66 87 66 92 64 C96 62 96 59 94 55 C90 46 80 31 70 19 C66 14 63 12 60 12 Z" />
      <path d="M54 67 C53 82 52 93 52 101 C51 109 50 115 52 120 C54 124 57 125 60 125 C63 125 66 124 68 120 C70 115 69 109 68 101 C68 93 67 82 66 67 C63 68 57 68 54 67 Z" />
      <ellipse cx="33" cy="81" rx="3.6" ry="8" transform="rotate(30 33 81)" />
      <ellipse cx="42" cy="95" rx="3.8" ry="9" transform="rotate(14 42 95)" />
      <ellipse cx="87" cy="81" rx="3.6" ry="8" transform="rotate(-30 87 81)" />
      <ellipse cx="78" cy="95" rx="3.8" ry="9" transform="rotate(-14 78 95)" />
    </g>
  </svg>
);

export default function Home() {
  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 0", borderBottom: "1px solid var(--sand)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Logo />
          <span className="serif" style={{ fontWeight: 600, fontSize: 24 }}>FungiPath</span>
        </div>
        <div style={{ display: "flex", gap: 36, fontWeight: 500 }}>
          <a href="#ciclo">El ciclo</a><a href="#tools">Herramientas</a><a href="#seg">Seguridad</a>
        </div>
        <Link href="/dashboard" className="btn">Empezar gratis</Link>
      </nav>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", padding: "80px 0" }}>
        <div>
          <div style={{ color: "var(--terracotta)", fontWeight: 700, letterSpacing: 2, fontSize: 13, textTransform: "uppercase", marginBottom: 24 }}>
            — Inteligencia forestal predictiva
          </div>
          <h1 className="serif" style={{ fontSize: 64, lineHeight: 1.02, fontWeight: 900, letterSpacing: -1.5 }}>
            Sabe dónde y cuándo brotará <span style={{ fontStyle: "italic", fontWeight: 500, color: "var(--clay)" }}>el bosque</span>
          </h1>
          <p style={{ fontSize: 18, color: "var(--umber)", marginTop: 24, lineHeight: 1.6, maxWidth: 480 }}>
            FungiPath cruza clima, satélite y tu propio terreno para predecir la aparición de hongos de alto valor — y te enseña a reconocerlos sin riesgos.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 36 }}>
            <Link href="/dashboard" className="btn">Predecir mi zona →</Link>
            <a href="#ciclo" className="btn-ghost">Ver cómo funciona</a>
          </div>
        </div>
        <div style={{ background: "#faf5ec", border: "1px solid var(--sand)", borderRadius: 18, padding: 16, boxShadow: "0 30px 70px rgba(46,35,27,.18)" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "6px 6px 14px" }}>
            <span style={{ width: 10, height: 10, borderRadius: 5, background: "#c87a5e" }} />
            <span style={{ width: 10, height: 10, borderRadius: 5, background: "#d9b06a" }} />
            <span style={{ width: 10, height: 10, borderRadius: 5, background: "#a3b487" }} />
            <span style={{ marginLeft: 10, fontSize: 12, color: "var(--stone)", fontWeight: 600 }}>FungiPath · Mapa de hotspots</span>
          </div>
          <div style={{ background: "var(--ink)", color: "var(--cream)", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div className="serif" style={{ fontStyle: "italic", fontSize: 17 }}>Boletus edulis</div>
                <div style={{ fontSize: 12, color: "#b0a392" }}>Hayedo · 920 m · ladera N</div>
              </div>
              <div className="serif" style={{ fontWeight: 700, fontSize: 34, color: "var(--terracotta)" }}>91%</div>
            </div>
            <p style={{ fontSize: 13, color: "#cabdac", marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,.12)", lineHeight: 1.5 }}>
              <b style={{ color: "var(--cream)" }}>Por qué:</b> 40 mm de lluvia hace 9 días, suelo a 14 °C, ladera norte que retiene humedad.
            </p>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid var(--sand)", padding: "40px 0", color: "var(--stone)", fontSize: 14 }}>
        FungiPath · Inteligencia forestal predictiva · Educativo. No autoriza el consumo de setas.
      </footer>
    </main>
  );
}
