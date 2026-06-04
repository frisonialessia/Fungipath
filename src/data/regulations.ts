// Normativa de recolección por país/región (orientativa, educativa).
// MOCK (PoC): datos de referencia; SIEMPRE verificar la normativa local vigente.
import type { Loc } from "@/lib/locale";
const L = (en: string, es: string): Loc => ({ en, es });

export interface Regulation {
  id: string; region: string; flag: string;
  license: boolean;            // ¿requiere permiso/tesserino?
  quota: string;               // cupo orientativo
  note: Loc;                   // resumen de la norma
  protected: string;           // especies protegidas / vedadas
}

export const REGULATIONS: Regulation[] = [
  { id: "it-lomb", region: "Italia · Lombardía", flag: "🇮🇹", license: true, quota: "≈ 3 kg/día",
    note: L("Permit ('tesserino') usually required; harvest only on allowed days, cut don't uproot.", "Suele exigir permiso ('tesserino'); recolecta solo días permitidos, corta sin arrancar."),
    protected: "Amanita caesarea (regulada)" },
  { id: "es-cyl", region: "España · Castilla y León", flag: "🇪🇸", license: true, quota: "2–5 kg/día",
    note: L("Regulated micological parks; permit per zone, daily limits, basket and knife only.", "Parques micológicos regulados; permiso por zona, límites diarios, solo cesta y navaja."),
    protected: "Varía por reserva" },
  { id: "fr", region: "Francia", flag: "🇫🇷", license: false, quota: "≈ 5 L/día (uso personal)",
    note: L("Generally tolerated for personal use on public land; commune by-laws may restrict.", "Tolerada para uso personal en suelo público; ordenanzas municipales pueden restringir."),
    protected: "Reservas naturales" },
  { id: "de", region: "Alemania", flag: "🇩🇪", license: false, quota: "≈ 1 kg/día (personal)",
    note: L("Personal-use 'Handstrauß' rule; commercial picking forbidden; many protected species.", "Regla 'Handstrauß' de uso personal; prohibida la venta; muchas especies protegidas."),
    protected: "Cantharellus, Boletus (límite)" },
  { id: "uk", region: "Reino Unido", flag: "🏴", license: false, quota: "1.5 kg orientativo",
    note: L("Allowed for personal use with landowner consent; banned on many SSSIs; no commercial.", "Permitida para uso personal con permiso del propietario; vetada en muchos SSSI; no comercial."),
    protected: "SSSI / áreas protegidas" },
  { id: "fi", region: "Finlandia", flag: "🇫🇮", license: false, quota: "Sin límite",
    note: L("Everyman's right: free foraging of mushrooms and berries on most land.", "Derecho de acceso libre: recolección gratuita de setas y bayas en casi todo el territorio."),
    protected: "Reservas naturales" },
];
