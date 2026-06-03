import Link from "next/link";
import Logo from "@/components/Logo";
import LandingTools from "@/components/landing/LandingTools";
import { SPECIES } from "@/lib/species";

const marquee = SPECIES.slice(0, 8).concat(SPECIES.slice(0, 8));

export default function Home() {
  return (
    <>
      {/* NAV */}
      <nav className="land"><div className="wrap">
        <div className="brand"><Logo /><b>FungiPath</b></div>
        <div className="nav-links"><a href="#cycle">El ciclo</a><a href="#tools">Herramientas</a><a href="#safety">Seguridad</a></div>
        <Link href="/dashboard" className="nav-cta">Empezar gratis</Link>
      </div></nav>

      {/* HERO */}
      <header className="hero"><div className="wrap">
        <div>
          <span className="eyebrow">Inteligencia forestal predictiva</span>
          <h1>Sabe dónde y cuándo<br />brotará <em>el bosque</em></h1>
          <p className="lede">FungiPath cruza clima, satélite y tu propio terreno para predecir la aparición de hongos de alto valor — y te enseña a reconocerlos sin riesgos.</p>
          <div className="actions">
            <Link href="/dashboard" className="btn-p">Predecir mi zona →</Link>
            <a href="#cycle" className="btn-g">Ver cómo funciona</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-mockup">
            <div className="mock-window">
              <div className="mock-bar"><span className="md r" /><span className="md y" /><span className="md g" /><span className="mock-title">FungiPath · Mapa de hotspots</span></div>
              <div className="mock-body">
                <div className="mock-map">
                  <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                    <polygon points="50,40 90,30 130,45 135,80 100,95 55,85 38,60" fill="#52c871" opacity="0.16" />
                    <polygon points="70,50 100,45 118,62 108,82 78,82 62,66" fill="#85df42" opacity="0.13" />
                    <polygon points="200,110 250,100 285,120 280,155 235,165 198,140" fill="#52c871" opacity="0.15" />
                    <ellipse cx="55" cy="135" rx="26" ry="16" fill="#0e9b3d" opacity="0.12" />
                    <g stroke="#cbbf9c" strokeWidth="0.5" opacity="0.22">
                      <line x1="40" y1="0" x2="40" y2="200" /><line x1="120" y1="0" x2="120" y2="200" /><line x1="200" y1="0" x2="200" y2="200" /><line x1="280" y1="0" x2="280" y2="200" />
                      <line x1="0" y1="40" x2="320" y2="40" /><line x1="0" y1="120" x2="320" y2="120" />
                    </g>
                    <path d="M30,20 Q70,70 60,110 Q50,150 90,190" fill="none" stroke="#7ba8b0" strokeWidth="2.5" opacity="0.55" />
                    <text x="10" y="16" fontFamily="monospace" fontSize="8" fill="#9c8f7d" opacity="0.8">45°48&apos;N 9°12&apos;E</text>
                  </svg>
                  <div className="mpin" style={{ top: "42%", left: "28%" }}><div className="mpin-h" style={{ background: "#8b3f29" }}><span>91</span></div></div>
                  <div className="mpin" style={{ top: "70%", left: "68%" }}><div className="mpin-h" style={{ background: "#a86543" }}><span>74</span></div></div>
                  <div className="mpin" style={{ top: "54%", left: "48%" }}><div className="mpin-h" style={{ background: "#c08a5e" }}><span>58</span></div></div>
                  <div className="mock-legend">● Punto caliente</div>
                </div>
                <div className="mock-explain">
                  <div className="me-top"><div><div className="me-sp">Boletus edulis</div><div className="me-hb">Hayedo · 920 m · ladera N</div></div><div className="me-big">91%</div></div>
                  <div className="me-why"><b>Por qué:</b> 40 mm de lluvia hace 9 días, suelo a 14 °C, ladera norte que retiene humedad.</div>
                  <div className="me-factors"><span>Lluvia 40mm</span><span>14 °C</span><span>NDVI 0.78</span></div>
                </div>
              </div>
            </div>
            <div className="float-tag ft1"><div className="v">91%</div><div className="l">prob. aparición</div></div>
            <div className="float-tag ft2"><div className="v">~4 días</div><div className="l">ventana abierta</div></div>
          </div>
        </div>
      </div></header>

      {/* MARQUEE */}
      <div className="marquee"><div className="marquee-track">{marquee.map((s, i) => <span key={i}>{s.n}</span>)}</div></div>

      {/* CICLO */}
      <section className="cycle" id="cycle"><div className="wrap">
        <div className="section-head">
          <div className="k">Biología hecha predicción</div>
          <h2>Del <em>espora</em> al hongo:<br />dónde entra FungiPath</h2>
          <p>Un hongo no aparece de la nada. Recorre un ciclo de semanas bajo tierra. Nosotros lo modelamos para anticipar la cosecha antes de que sea visible.</p>
        </div>
        <div className="cycle-stages">
          <div className="stage"><div className="disc"><span className="num">1</span><svg viewBox="0 0 62 62"><g fill="#f1e7db"><circle cx="20" cy="24" r="3" /><circle cx="34" cy="18" r="2.4" /><circle cx="44" cy="28" r="3" /><circle cx="28" cy="36" r="2.6" /><circle cx="40" cy="42" r="2.2" /><circle cx="18" cy="40" r="2.4" /></g></svg></div><h3>Espora</h3><p>El hongo libera millones de esporas que caen al sustrato.</p></div>
          <div className="stage"><div className="disc"><span className="num">2</span><svg viewBox="0 0 62 62"><g stroke="#f1e7db" strokeWidth="1.6" fill="none" strokeLinecap="round"><path d="M31 31 L18 18" /><path d="M31 31 L44 16" /><path d="M31 31 L16 38" /><path d="M31 31 L46 40" /><path d="M31 31 L31 14" /></g></svg></div><h3>Micelio</h3><p>Germinan en hifas que se entrelazan y colonizan la madera o el suelo.</p></div>
          <div className="stage key"><div className="disc"><span className="num">3</span><svg viewBox="0 0 62 62"><g fill="#f1e7db"><circle cx="24" cy="40" r="6" /><circle cx="36" cy="38" r="5" /></g></svg></div><h3>Primordio</h3><p>Se forma el &quot;alfiler&quot;, el embrión del hongo. Aún invisible en superficie.</p><span className="pin">◆ Aquí predecimos</span></div>
          <div className="stage"><div className="disc"><span className="num">4</span><svg viewBox="0 0 62 62"><path d="M31 16 C20 16 14 24 14 28 C14 30 18 31 31 31 C44 31 48 30 48 28 C48 24 42 16 31 16 Z" fill="#f1e7db" /><path d="M28 31 Q27 42 28 48 Q31 49 34 48 Q35 42 34 31 Z" fill="#f1e7db" /></svg></div><h3>Fructificación</h3><p>El hongo emerge y madura. La ventana de recolección se abre.</p><span className="pin">◆ Te avisamos</span></div>
          <div className="stage"><div className="disc"><span className="num">5</span><svg viewBox="0 0 62 62"><path d="M31 18 C22 18 17 24 17 27 C17 29 20 30 31 30 C42 30 45 29 45 27 C45 24 40 18 31 18 Z" fill="#f1e7db" /><g fill="#f1e7db" opacity=".7"><circle cx="22" cy="40" r="2" /><circle cx="31" cy="44" r="2" /><circle cx="40" cy="40" r="2" /></g></svg></div><h3>Dispersión</h3><p>Libera nuevas esporas y el ciclo recomienza. Nuestro modelo aprende.</p></div>
        </div>
        <p className="cycle-note">La mayoría de apps te muestran el hongo cuando ya cualquiera lo ve. <b>FungiPath predice la fase de primordio</b> — los días en que el bosque se prepara, antes de que haya nada que recoger.</p>
      </div></section>

      {/* HERRAMIENTAS */}
      <section className="tools" id="tools"><div className="wrap">
        <div className="section-head">
          <div className="k">Caja de herramientas</div>
          <h2>Para quien <em>vende</em><br />y para quien <em>aprende</em></h2>
          <p>Dos públicos, dos necesidades. Herramientas que no encontrarás en ninguna otra app de hongos.</p>
        </div>
        <LandingTools />
      </div></section>

      {/* SEGURIDAD */}
      <section className="safety" id="safety"><div className="wrap">
        <div>
          <div className="badge"><Logo /></div>
          <h2>La identificación<br />es cosa <em>seria</em></h2>
          <p>Confundir un hongo puede matar. Por eso FungiPath educa para mirar bien — nunca da un &quot;cómelo&quot; a ciegas. Toda ficha exige verificación con un experto local.</p>
        </div>
        <div className="points">
          <div className="pt"><div className="d" /><div><b>Identificación guiada por características</b><span>Te preguntamos láminas, corte, anillo, hábitat — y aprendes a observar como un micólogo.</span></div></div>
          <div className="pt"><div className="d" /><div><b>Comparador de sosias venenosos</b><span>Cada comestible, lado a lado con su gemelo tóxico y las diferencias señaladas.</span></div></div>
          <div className="pt"><div className="d" /><div><b>Comestibilidad por región del mundo</b><span>Una especie se come en el norte de Italia y se evita en Norteamérica. Mapeamos esas diferencias.</span></div></div>
          <div className="pt"><div className="d" /><div><b>Agente de IA guía del bosque</b><span>Pregunta lo que quieras: por qué un sitio está activo, qué especie es, dónde ir mañana.</span></div></div>
        </div>
      </div></section>

      {/* FINAL */}
      <section className="final"><div className="wrap">
        <h2>El bosque tiene<br />un <em>patrón</em></h2>
        <p>Empieza a leerlo. Marca tu primer hotspot y deja que FungiPath aprenda contigo.</p>
        <Link href="/dashboard" className="btn-p">Crear mi cuenta gratis →</Link>
      </div></section>

      <footer><div className="wrap">
        <div className="brand"><Logo /><b>FungiPath</b></div>
        <small>Datos: Open-Meteo · Copernicus Sentinel-2 · GBIF · Educativo. No autoriza el consumo de setas.</small>
      </div></footer>
    </>
  );
}
