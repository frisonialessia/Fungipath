"use client";
import { useEffect, useMemo, useState } from "react";
import type { Hotspot } from "@/data/hotspots";
import { SPECIES } from "@/lib/species";
import { SEED_LOTS, SEED_BUYERS, lotCode, type Lot, type Buyer, type Grade, type LotStatus } from "@/data/business";
import { useI18n } from "@/lib/i18n";
import { useToast } from "../shared";

const STATUS_COLOR: Record<LotStatus, string> = { harvested: "var(--stone)", sold: "var(--terracotta)", delivered: "var(--ok)" };

export default function Business({ hotspots }: { hotspots: Hotspot[] }) {
  const { t } = useI18n();
  const toast = useToast();
  const [lots, setLots] = useState<Lot[]>(SEED_LOTS);
  const [buyers, setBuyers] = useState<Buyer[]>(SEED_BUYERS);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    try { const l = localStorage.getItem("fp_lots"); if (l) setLots(JSON.parse(l)); const b = localStorage.getItem("fp_buyers"); if (b) setBuyers(JSON.parse(b)); } catch { /* noop */ }
  }, []);
  const persistLots = (next: Lot[]) => { setLots(next); try { localStorage.setItem("fp_lots", JSON.stringify(next)); } catch { /* noop */ } };
  const persistBuyers = (next: Buyer[]) => { setBuyers(next); try { localStorage.setItem("fp_buyers", JSON.stringify(next)); } catch { /* noop */ } };

  const totalKg = useMemo(() => lots.reduce((s, l) => s + l.kg, 0), [lots]);
  const revenue = useMemo(() => lots.filter((l) => l.status !== "harvested").reduce((s, l) => s + l.kg * l.pricePerKg, 0), [lots]);
  const topSpecies = useMemo(() => {
    const m: Record<string, number> = {}; lots.forEach((l) => { m[l.species] = (m[l.species] || 0) + l.kg; });
    return Object.entries(m).sort((a, b) => b[1] - a[1])[0]?.[0]?.split(" ")[0] || "—";
  }, [lots]);

  function exportCsv() {
    const head = [t("business.code"), t("business.date"), t("business.species"), t("business.kg"), t("business.grade"), t("business.origin"), t("business.buyer"), t("business.price"), t("business.total"), t("business.status")];
    const rows = lots.map((l) => [l.code, l.date, l.species, l.kg, l.grade, l.origin, l.buyer, l.pricePerKg, (l.kg * l.pricePerKg).toFixed(2), l.status]);
    const csv = [head, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "fungipath-lots.csv"; a.click(); URL.revokeObjectURL(url);
    toast(t("business.exported"));
  }

  return (
    <div>
      <div className="topbar">
        <div><h1 className="serif">{t("business.title")}</h1><p>{t("business.sub")}</p></div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-ghost2" style={{ flex: "none", padding: "12px 18px" }} onClick={exportCsv}>{t("business.export")}</button>
          <button className="btn" onClick={() => setModal(true)}>{t("business.add")}</button>
        </div>
      </div>

      <div className="metrics">
        <div className="card reveal"><div className="k-label">{t("business.mLots")}</div><div className="k-value">{lots.length}</div></div>
        <div className="card reveal"><div className="k-label">{t("business.mKg")}</div><div className="k-value">{totalKg.toFixed(1)}<span className="u"> kg</span></div></div>
        <div className="card reveal"><div className="k-label">{t("business.mRevenue")}</div><div className="k-value">{Math.round(revenue)}<span className="u"> €</span></div></div>
        <div className="card reveal"><div className="k-label">{t("business.mTop")}</div><div className="k-value" style={{ fontSize: 24, fontStyle: "italic" }}>{topSpecies}</div></div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: "1.7fr 1fr", alignItems: "start" }}>
        <div className="card">
          <div className="panel-head"><h3 className="serif">{t("business.lotsTitle")}</h3><span>{lots.length}</span></div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, minWidth: 640 }}>
              <thead><tr style={{ color: "var(--stone)", textAlign: "left" }}>
                {[t("business.code"), t("business.date"), t("business.species"), t("business.kg"), t("business.grade"), t("business.buyer"), t("business.total"), t("business.status")].map((h) => <th key={h} style={{ padding: "6px 8px", fontWeight: 600, borderBottom: "1px solid var(--sand)" }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {lots.map((l) => (
                  <tr key={l.id} style={{ borderBottom: "1px solid var(--sand)" }}>
                    <td style={{ padding: "8px", fontFamily: "monospace", fontSize: 11 }}>{l.code}</td>
                    <td style={{ padding: "8px", whiteSpace: "nowrap" }}>{l.date}</td>
                    <td style={{ padding: "8px", fontStyle: "italic" }}>{l.species}</td>
                    <td style={{ padding: "8px" }}>{l.kg}</td>
                    <td style={{ padding: "8px" }}><span style={{ fontWeight: 700, color: l.grade === "A" ? "var(--moss)" : l.grade === "B" ? "var(--terracotta)" : "var(--stone)" }}>{l.grade}</span></td>
                    <td style={{ padding: "8px" }}>{l.buyer}</td>
                    <td style={{ padding: "8px", fontWeight: 600 }}>{(l.kg * l.pricePerKg).toFixed(0)} €</td>
                    <td style={{ padding: "8px" }}><span style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[l.status] }}>● {t(`business.s${l.status[0].toUpperCase() + l.status.slice(1)}`)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="warn-box" style={{ background: "rgba(168,101,67,.08)", borderColor: "rgba(168,101,67,.2)", color: "var(--umber)" }}>{t("business.disclaimer")}</div>
        </div>

        <div className="card">
          <div className="panel-head"><h3 className="serif">{t("business.buyersTitle")}</h3><span>{buyers.length}</span></div>
          {buyers.length === 0 && <p style={{ fontSize: 12.5, color: "var(--stone)", marginBottom: 10 }}>{t("business.noBuyers")}</p>}
          {buyers.map((b, i) => (
            <div className="priv-row" key={i}><div><div className="pn">{b.name}</div><div style={{ fontSize: 12, color: "var(--stone)" }}>{b.type}</div></div></div>
          ))}
          <button className="btn-ghost2" style={{ width: "100%", marginTop: 10 }} onClick={() => persistBuyers([...buyers, { name: "Nuevo comprador", type: "" }])}>{t("business.addBuyer")}</button>
        </div>
      </div>

      {modal && <LotModal hotspots={hotspots} buyers={buyers} onClose={() => setModal(false)} onCreate={(l) => { persistLots([l, ...lots]); toast(t("business.created", { code: l.code })); }} />}
    </div>
  );
}

function LotModal({ hotspots, buyers, onClose, onCreate }: { hotspots: Hotspot[]; buyers: Buyer[]; onClose: () => void; onCreate: (l: Lot) => void }) {
  const { t } = useI18n();
  const edible = SPECIES.filter((s) => s.edib === "choice" || s.edib === "edible");
  const [species, setSpecies] = useState(edible[0].n);
  const [kg, setKg] = useState("");
  const [grade, setGrade] = useState<Grade>("A");
  const [origin, setOrigin] = useState(hotspots[0]?.name ?? "");
  const [buyer, setBuyer] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<LotStatus>("harvested");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  function save() {
    const code = lotCode();
    onCreate({ id: "l" + Date.now(), code, date, species, kg: parseFloat(kg) || 0, grade, origin, buyer: buyer || "—", pricePerKg: parseFloat(price) || 0, status });
    onClose();
  }

  return (
    <div className="modal-bg show" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h3 className="serif">{t("business.mTitle")}</h3>
        <p className="sub">{t("business.mSub")}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div className="field"><label>{t("business.species")}</label><select value={species} onChange={(e) => setSpecies(e.target.value)}>{edible.map((s) => <option key={s.n}>{s.n}</option>)}</select></div>
          <div className="field"><label>{t("business.date")}</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div className="field"><label>{t("business.kg")}</label><input type="number" step="0.1" placeholder="2.5" value={kg} onChange={(e) => setKg(e.target.value)} /></div>
          <div className="field"><label>{t("business.grade")}</label><select value={grade} onChange={(e) => setGrade(e.target.value as Grade)}><option>A</option><option>B</option><option>C</option></select></div>
          <div className="field"><label>{t("business.origin")}</label><select value={origin} onChange={(e) => setOrigin(e.target.value)}>{hotspots.map((h) => <option key={h.name}>{h.name}</option>)}</select></div>
          <div className="field"><label>{t("business.buyer")}</label><select value={buyer} onChange={(e) => setBuyer(e.target.value)}><option value="">{t("business.fNone")}</option>{buyers.map((b) => <option key={b.name}>{b.name}</option>)}</select></div>
          <div className="field"><label>{t("business.price")}</label><input type="number" step="1" placeholder="30" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
          <div className="field"><label>{t("business.status")}</label><select value={status} onChange={(e) => setStatus(e.target.value as LotStatus)}><option value="harvested">{t("business.sHarvested")}</option><option value="sold">{t("business.sSold")}</option><option value="delivered">{t("business.sDelivered")}</option></select></div>
        </div>
        <div className="modal-actions"><button className="btn-ghost2" onClick={onClose}>{t("business.cancel")}</button><button className="btn" onClick={save}>{t("business.save")}</button></div>
      </div>
    </div>
  );
}
