"use client";
import { useRef, useState } from "react";
import { SPECIES, type Species } from "@/lib/species";
import { spIllust } from "@/lib/illustrations";
import { useI18n, tx } from "@/lib/i18n";
import { Illu } from "../shared";

interface Match { sp: Species; conf: number; }

function hexRgb(h: string): [number, number, number] {
  const n = parseInt(h.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Coincidencia visual local (demo): color medio de la foto vs. color del sombrero.
async function analyze(file: File): Promise<Match[]> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = url;
    });
    const c = document.createElement("canvas");
    const S = 64; c.width = S; c.height = S;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0, S, S);
    // muestrea la región central (evita fondo/bordes)
    const d = ctx.getImageData(S * 0.28, S * 0.18, S * 0.44, S * 0.5).data;
    let r = 0, g = 0, b = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 40) continue;            // ignora transparente
      const lum = (d[i] + d[i + 1] + d[i + 2]) / 3;
      if (lum > 240 || lum < 14) continue;     // ignora blanco/negro de fondo
      r += d[i]; g += d[i + 1]; b += d[i + 2]; n++;
    }
    n = n || 1; const avg: [number, number, number] = [r / n, g / n, b / n];
    const ranked = SPECIES.map((sp) => {
      const [cr, cg, cb] = hexRgb(sp.cap);
      const dist = Math.sqrt((avg[0] - cr) ** 2 + (avg[1] - cg) ** 2 + (avg[2] - cb) ** 2);
      return { sp, conf: Math.max(38, Math.min(94, Math.round(95 - dist * 0.45))) };
    }).sort((a, b) => b.conf - a.conf);
    return ranked.slice(0, 3);
  } finally { URL.revokeObjectURL(url); }
}

export default function Identify({ onAskGuide }: { onAskGuide: (name: string) => void }) {
  const { t, locale } = useI18n();
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [matches, setMatches] = useState<Match[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file?: File) {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setStatus("loading"); setMatches([]);
    try {
      // SEAM: si /api/identify estuviera configurado con un modelo real,
      // aquí se llamaría primero. En demo usamos la coincidencia local.
      const m = await analyze(file);
      await new Promise((r) => setTimeout(r, 700)); // "analizando…"
      setMatches(m); setStatus("done");
    } catch { setStatus("idle"); }
  }

  const best = matches[0];
  const twin = best && (() => {
    const key = best.sp.twin.en.split(" ")[0];
    return SPECIES.find((s) => s.n.split(" ")[0] === key && s.n !== best.sp.n) || null;
  })();

  return (
    <div>
      <div className="topbar"><div><h1 className="serif">{t("identify.title")}</h1><p>{t("identify.sub")}</p></div></div>

      <div className="grid-2" style={{ gridTemplateColumns: "1fr 1.2fr", alignItems: "start" }}>
        {/* zona de subida / preview */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files?.[0])} />
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }}
            style={{ cursor: "pointer", minHeight: 320, display: "grid", placeItems: "center", background: preview ? "#2e231b" : "radial-gradient(120% 100% at 50% 16%, #fcf8f0, #e9e0cf)", position: "relative" }}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" style={{ width: "100%", height: "100%", maxHeight: 420, objectFit: "contain" }} />
            ) : (
              <div style={{ textAlign: "center", color: "var(--ink-soft)", padding: 30 }}>
                <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="var(--terracotta)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}><path d="M3 8 V6 A2 2 0 0 1 5 4 H7 L8.5 2 H15.5 L17 4 H19 A2 2 0 0 1 21 6 V18 A2 2 0 0 1 19 20 H5 A2 2 0 0 1 3 18 Z" /><circle cx="12" cy="12" r="3.5" /></svg>
                <div style={{ fontWeight: 600 }}>{t("identify.drop")}</div>
              </div>
            )}
          </div>
          {preview && <div style={{ padding: 14, textAlign: "center" }}><button className="btn-ghost2" style={{ width: "100%" }} onClick={() => { setPreview(null); setStatus("idle"); setMatches([]); }}>{t("identify.again")}</button></div>}
        </div>

        {/* resultados */}
        <div>
          {status === "idle" && (
            <div className="card"><div className="warn-box" style={{ marginTop: 0 }}><b>FungiPath</b>{t("identify.safety")}</div></div>
          )}
          {status === "loading" && (
            <div className="card" style={{ display: "grid", placeItems: "center", minHeight: 200 }}>
              <div style={{ textAlign: "center" }}>
                <div className="sk" style={{ width: 80, height: 80, borderRadius: "50%", margin: "0 auto 14px" }} />
                <div style={{ color: "var(--stone)", fontWeight: 600 }}>{t("identify.analyzing")}</div>
              </div>
            </div>
          )}
          {status === "done" && best && (
            <>
              <div className="card" style={{ marginBottom: 15 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".8px", color: "var(--terracotta)", marginBottom: 12 }}>{t("identify.best")}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <Illu style={{ filter: "drop-shadow(0 5px 7px rgba(46,35,27,.2))" }} html={spIllust(best.sp, 64)} />
                  <div style={{ flex: 1 }}>
                    <div className="serif" style={{ fontStyle: "italic", fontSize: 20 }}>{best.sp.n}</div>
                    <div style={{ fontSize: 13, color: "var(--stone)", marginBottom: 8 }}>{tx(best.sp.com, locale)}</div>
                    <span className={`edib ${best.sp.edib}`}>{t(`edib.${best.sp.edib}`)}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "Fraunces", fontWeight: 700, fontSize: 30, color: "var(--terracotta)" }}>{best.conf}%</div>
                    <div style={{ fontSize: 10, color: "var(--stone)", textTransform: "uppercase", letterSpacing: ".5px" }}>{t("identify.confidence")}</div>
                  </div>
                </div>
                {matches.length > 1 && (
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--sand)" }}>
                    <div style={{ fontSize: 11, color: "var(--stone)", marginBottom: 8, fontWeight: 600 }}>{t("identify.also")}</div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {matches.slice(1).map((m) => (
                        <div key={m.sp.n} style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--cream-2)", borderRadius: 12, padding: "6px 12px 6px 6px" }}>
                          <Illu html={spIllust(m.sp, 30)} />
                          <div><div style={{ fontStyle: "italic", fontSize: 13 }}>{m.sp.n}</div><div style={{ fontSize: 11, color: "var(--stone)" }}>{m.conf}%</div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="modal-actions" style={{ marginTop: 16 }}>
                  <button className="btn" onClick={() => onAskGuide(best.sp.n)}>{t("identify.ask")}</button>
                </div>
              </div>

              {twin && (
                <div className="card" style={{ marginBottom: 15, border: "1.5px solid rgba(139,63,41,.3)" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--clay)", marginBottom: 12 }}>{t("identify.lookalike")}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <Illu html={spIllust(twin, 48)} />
                    <div style={{ flex: 1 }}><div className="serif" style={{ fontStyle: "italic", fontSize: 16 }}>{twin.n}</div><div style={{ fontSize: 12, color: "var(--stone)" }}>{tx(twin.com, locale)} · {tx(twin.note, locale)}</div></div>
                    <span className={`edib ${twin.edib}`}>{t(`edib.${twin.edib}`)}</span>
                  </div>
                </div>
              )}

              <div className="card">
                <div className="warn-box" style={{ marginTop: 0 }}><b>⚠️ {t("species.warnSafe")}</b>{t("identify.safety")}</div>
                <div style={{ fontSize: 11.5, color: "var(--stone)", marginTop: 12, lineHeight: 1.5 }}>{t("identify.demo")}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
