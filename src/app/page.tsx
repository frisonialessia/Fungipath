"use client";
import Link from "next/link";
import Logo from "@/components/Logo";
import LangToggle from "@/components/LangToggle";
import LandingTools from "@/components/landing/LandingTools";
import Reveal from "@/components/landing/Reveal";
import { useT } from "@/lib/i18n";
import { SPECIES } from "@/lib/species";

const marquee = SPECIES.slice(0, 8).concat(SPECIES.slice(0, 8));
const SOURCES = ["Open-Meteo", "GBIF", "Sentinel-2", "OpenStreetMap"];

export default function Home() {
  const t = useT();
  const STATS: [string, string][] = [
    [`128+`, t("landing.stat1")],
    [t("landing.stat2v"), t("landing.stat2")],
    [t("landing.stat3v"), t("landing.stat3")],
    [t("landing.stat4v"), t("landing.stat4")],
  ];

  return (
    <>
      <nav className="land"><div className="wrap">
        <div className="brand"><Logo /><b>FungiPath</b></div>
        <div className="nav-links"><a href="#cycle">{t("landing.navCycle")}</a><a href="#tools">{t("landing.navTools")}</a><a href="#safety">{t("landing.navSafety")}</a></div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <LangToggle />
          <Link href="/dashboard" className="nav-cta">{t("landing.navCta")}</Link>
        </div>
      </div></nav>

      <header className="hero"><div className="wrap">
        <div>
          <span className="eyebrow">{t("landing.eyebrow")}</span>
          <h1>{t("landing.h1a")} <em>{t("landing.h1b")}</em> {t("landing.h1c")}</h1>
          <p className="lede">{t("landing.lede")}</p>
          <div className="actions">
            <Link href="/dashboard" className="btn-p">{t("landing.ctaPredict")}</Link>
            <a href="#cycle" className="btn-g">{t("landing.ctaHow")}</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-mockup">
            <div className="mock-window">
              <div className="mock-bar"><span className="md r" /><span className="md y" /><span className="md g" /><span className="mock-title">{t("landing.mockTitle")}</span></div>
              <div className="mock-body">
                <div className="mock-map">
                  <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                    <polygon points="50,40 90,30 130,45 135,80 100,95 55,85 38,60" fill="#52c871" opacity="0.16" />
                    <polygon points="200,110 250,100 285,120 280,155 235,165 198,140" fill="#52c871" opacity="0.15" />
                    <ellipse cx="55" cy="135" rx="26" ry="16" fill="#0e9b3d" opacity="0.12" />
                    <g stroke="#cbbf9c" strokeWidth="0.5" opacity="0.22"><line x1="40" y1="0" x2="40" y2="200" /><line x1="120" y1="0" x2="120" y2="200" /><line x1="200" y1="0" x2="200" y2="200" /><line x1="280" y1="0" x2="280" y2="200" /><line x1="0" y1="40" x2="320" y2="40" /><line x1="0" y1="120" x2="320" y2="120" /></g>
                    <path d="M30,20 Q70,70 60,110 Q50,150 90,190" fill="none" stroke="#7ba8b0" strokeWidth="2.5" opacity="0.55" />
                  </svg>
                  <div className="mpin" style={{ top: "42%", left: "28%" }}><div className="mpin-h" style={{ background: "#8b3f29" }}><span>91</span></div></div>
                  <div className="mpin" style={{ top: "70%", left: "68%" }}><div className="mpin-h" style={{ background: "#a86543" }}><span>74</span></div></div>
                  <div className="mpin" style={{ top: "54%", left: "48%" }}><div className="mpin-h" style={{ background: "#c08a5e" }}><span>58</span></div></div>
                  <div className="mock-legend">● {t("landing.mockHotspot")}</div>
                </div>
                <div className="mock-explain">
                  <div className="me-top"><div><div className="me-sp">Boletus edulis</div><div className="me-hb">{t("soil.trees.broadleaf")} · 920 m · {t("aspect.N")}</div></div><div className="me-big">91%</div></div>
                  <div className="me-why"><b>{t("overview.why")}</b> {t("landing.mockWhy")}</div>
                  <div className="me-factors"><span>{t("factor.rain")} 40mm</span><span>14 °C</span><span>NDVI 0.78</span></div>
                </div>
              </div>
            </div>
            <div className="float-tag ft1"><div className="v">91%</div><div className="l">{t("landing.tagProb")}</div></div>
            <div className="float-tag ft2"><div className="v">{t("landing.tagWindowV")}</div><div className="l">{t("landing.tagWindow")}</div></div>
          </div>
        </div>
      </div></header>

      <div className="trust"><div className="wrap">
        <span className="lab">{t("landing.trustLabel")}</span>
        {SOURCES.map((s) => <span className="src" key={s}><span className="dot" />{s}</span>)}
      </div></div>

      <section style={{ padding: "64px 0" }}><div className="wrap">
        <Reveal>
          <div className="statband">
            {STATS.map(([v, l], i) => <div className="st" key={i}><div className="sv">{v}</div><div className="sl">{l}</div></div>)}
          </div>
        </Reveal>
      </div></section>

      <div className="marquee"><div className="marquee-track">{marquee.map((s, i) => <span key={i}>{s.n}</span>)}</div></div>

      <section className="cycle" id="cycle"><div className="wrap">
        <div className="section-head">
          <div className="k">{t("landing.cycleKicker")}</div>
          <h2>{t("landing.cycleTitleA")} <em>{t("landing.cycleTitleEm")}</em> {t("landing.cycleTitleB")}<br />{t("landing.cycleTitleC")}</h2>
          <p>{t("landing.cycleSub")}</p>
        </div>
        <Reveal><div className="cycle-stages">
          <div className="stage"><div className="disc"><span className="num">1</span><svg viewBox="0 0 62 62"><g fill="#f1e7db"><circle cx="20" cy="24" r="3" /><circle cx="34" cy="18" r="2.4" /><circle cx="44" cy="28" r="3" /><circle cx="28" cy="36" r="2.6" /><circle cx="40" cy="42" r="2.2" /><circle cx="18" cy="40" r="2.4" /></g></svg></div><h3>{t("landing.st1")}</h3><p>{t("landing.st1d")}</p></div>
          <div className="stage"><div className="disc"><span className="num">2</span><svg viewBox="0 0 62 62"><g stroke="#f1e7db" strokeWidth="1.6" fill="none" strokeLinecap="round"><path d="M31 31 L18 18" /><path d="M31 31 L44 16" /><path d="M31 31 L16 38" /><path d="M31 31 L46 40" /><path d="M31 31 L31 14" /></g></svg></div><h3>{t("landing.st2")}</h3><p>{t("landing.st2d")}</p></div>
          <div className="stage key"><div className="disc"><span className="num">3</span><svg viewBox="0 0 62 62"><g fill="#f1e7db"><circle cx="24" cy="40" r="6" /><circle cx="36" cy="38" r="5" /></g></svg></div><h3>{t("landing.st3")}</h3><p>{t("landing.st3d")}</p><span className="pin">{t("landing.st3pin")}</span></div>
          <div className="stage"><div className="disc"><span className="num">4</span><svg viewBox="0 0 62 62"><path d="M31 16 C20 16 14 24 14 28 C14 30 18 31 31 31 C44 31 48 30 48 28 C48 24 42 16 31 16 Z" fill="#f1e7db" /><path d="M28 31 Q27 42 28 48 Q31 49 34 48 Q35 42 34 31 Z" fill="#f1e7db" /></svg></div><h3>{t("landing.st4")}</h3><p>{t("landing.st4d")}</p><span className="pin">{t("landing.st4pin")}</span></div>
          <div className="stage"><div className="disc"><span className="num">5</span><svg viewBox="0 0 62 62"><path d="M31 18 C22 18 17 24 17 27 C17 29 20 30 31 30 C42 30 45 29 45 27 C45 24 40 18 31 18 Z" fill="#f1e7db" /><g fill="#f1e7db" opacity=".7"><circle cx="22" cy="40" r="2" /><circle cx="31" cy="44" r="2" /><circle cx="40" cy="40" r="2" /></g></svg></div><h3>{t("landing.st5")}</h3><p>{t("landing.st5d")}</p></div>
        </div></Reveal>
        <p className="cycle-note">{t("landing.cycleNote1")} <b>{t("landing.cycleNoteB")}</b>{t("landing.cycleNote2")}</p>
      </div></section>

      <section className="tools" id="tools"><div className="wrap">
        <div className="section-head">
          <div className="k">{t("landing.toolsKicker")}</div>
          <h2>{t("landing.toolsTitleA")} <em>{t("landing.toolsTitleSell")}</em><br />{t("landing.toolsTitleB")} <em>{t("landing.toolsTitleLearn")}</em></h2>
          <p>{t("landing.toolsSub")}</p>
        </div>
        <LandingTools />
      </div></section>

      <section className="safety" id="safety"><div className="wrap">
        <div>
          <div className="badge"><Logo /></div>
          <h2>{t("landing.safetyTitleA")}<br />{t("landing.safetyTitleB")} <em>{t("landing.safetyTitleEm")}</em> {t("landing.safetyTitleC")}</h2>
          <p>{t("landing.safetyLede")}</p>
        </div>
        <div className="points">
          <div className="pt"><div className="d" /><div><b>{t("landing.sp1")}</b><span>{t("landing.sp1d")}</span></div></div>
          <div className="pt"><div className="d" /><div><b>{t("landing.sp2")}</b><span>{t("landing.sp2d")}</span></div></div>
          <div className="pt"><div className="d" /><div><b>{t("landing.sp3")}</b><span>{t("landing.sp3d")}</span></div></div>
          <div className="pt"><div className="d" /><div><b>{t("landing.sp4")}</b><span>{t("landing.sp4d")}</span></div></div>
        </div>
      </div></section>

      <section className="final"><div className="wrap">
        <h2>{t("landing.finalA")}<br /><em>{t("landing.finalEm")}</em> {t("landing.finalB")}</h2>
        <p>{t("landing.finalSub")}</p>
        <Link href="/dashboard" className="btn-p">{t("landing.finalCta")}</Link>
      </div></section>

      <footer><div className="wrap">
        <div className="brand"><Logo /><b>FungiPath</b></div>
        <small>{t("landing.footer")}</small>
      </div></footer>
    </>
  );
}
