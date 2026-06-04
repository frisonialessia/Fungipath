"use client";
import { useState } from "react";
import { SPECIES } from "@/lib/species";
import { areaHa } from "@/data/parcels";
import { useT } from "@/lib/i18n";

export default function ParcelModal({ points, onClose, onCreate }: {
  points: [number, number][];
  onClose: () => void;
  onCreate: (name: string, species: string, notes: string) => void;
}) {
  const t = useT();
  const edible = SPECIES.filter((s) => s.edib === "choice" || s.edib === "edible");
  const [name, setName] = useState("");
  const [species, setSpecies] = useState(edible[0].n);
  const [notes, setNotes] = useState("");

  return (
    <div className="modal-bg show" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h3 className="serif">{t("parcel.title")}</h3>
        <p className="sub">{t("parcel.sub")}</p>
        <div className="warn-box" style={{ background: "rgba(109,138,75,.1)", borderColor: "rgba(109,138,75,.25)", color: "#54702f", marginTop: 0, marginBottom: 16 }}>
          <b>{t("parcel.drawn")}</b>{t("parcel.drawnBody", { v: points.length, a: areaHa(points) })}
        </div>
        <div className="field"><label>{t("parcel.fName")}</label><input placeholder={t("parcel.fNamePh")} value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="field"><label>{t("parcel.fSpecies")}</label><select value={species} onChange={(e) => setSpecies(e.target.value)}>{edible.map((s) => <option key={s.n}>{s.n}</option>)}</select></div>
        <div className="field"><label>{t("parcel.fNotes")}</label><input placeholder={t("parcel.fNotesPh")} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        <div className="modal-actions"><button className="btn-ghost2" onClick={onClose}>{t("parcel.cancel")}</button><button className="btn" onClick={() => { onCreate(name.trim() || t("parcel.untitled"), species, notes.trim()); onClose(); }}>{t("parcel.create")}</button></div>
      </div>
    </div>
  );
}
