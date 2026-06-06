"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

// Tour de primer uso (3 pasos). Se muestra una vez; el dismiss se guarda en localStorage.
// Sin backend. Marca de FungiPath como ilustración.
const MARK = (
  <svg viewBox="0 0 120 120" width="56" height="56" aria-hidden>
    <rect width="120" height="120" rx="28" fill="#241a12" />
    <path d="M24 72 A36 36 0 0 1 96 72 Z" fill="#9cd147" />
    <g fill="#52c871"><circle cx="44" cy="94" r="6" /><circle cx="60" cy="103" r="6.5" /><circle cx="76" cy="94" r="6" /></g>
  </svg>
);

export default function OnboardingTour() {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    try { if (!localStorage.getItem("fp_onboarded")) setShow(true); } catch { /* noop */ }
  }, []);

  function close() {
    setShow(false);
    try { localStorage.setItem("fp_onboarded", "1"); } catch { /* noop */ }
  }

  if (!show) return null;
  const steps = [
    { t: t("onb.t1"), b: t("onb.b1") },
    { t: t("onb.t2"), b: t("onb.b2") },
    { t: t("onb.t3"), b: t("onb.b3") },
  ];
  const last = step === steps.length - 1;

  return (
    <div className="onb-bg" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="onb-card" role="dialog" aria-modal="true">
        <div className="onb-mark">{MARK}</div>
        <div className="onb-kicker">{t("onb.kicker")}</div>
        <h3 className="onb-title">{steps[step].t}</h3>
        <p className="onb-body">{steps[step].b}</p>
        <div className="onb-dots">
          {steps.map((_, i) => <span key={i} className={`onb-dot${i === step ? " on" : ""}`} onClick={() => setStep(i)} />)}
        </div>
        <div className="onb-actions">
          <button className="btn-ghost2" onClick={close}>{t("onb.skip")}</button>
          <button className="btn" onClick={() => (last ? close() : setStep(step + 1))}>{last ? t("onb.start") : t("onb.next")}</button>
        </div>
      </div>
    </div>
  );
}
