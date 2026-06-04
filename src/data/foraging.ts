// Regiones míticas de recolección de setas en el mundo (datos reales de ubicación).
// La probabilidad se calcula EN VIVO con Open-Meteo en cada coordenada.
import type { Loc } from "@/lib/locale";

const L = (en: string, es: string): Loc => ({ en, es });

export interface ForagingSpot {
  id: string;
  name: string;        // topónimo (no se traduce)
  country: string;     // bandera + país (no se traduce)
  lat: number; lng: number;
  species: string;     // especie estrella (científico/común)
  aspect: "N" | "S" | "E" | "O";
  season: Loc;
  note: Loc;
}

export const FORAGING: ForagingSpot[] = [
  { id: "alba", name: "Alba · Piedmont", country: "🇮🇹 Italia", lat: 44.70, lng: 8.04, species: "Tuber magnatum", aspect: "N", season: L("Autumn–Winter", "Otoño–Invierno"), note: L("World capital of the white truffle, hunted with dogs in the Langhe hills.", "Capital mundial de la trufa blanca, buscada con perros en las colinas de Langhe.") },
  { id: "perigord", name: "Périgord", country: "🇫🇷 Francia", lat: 45.18, lng: 0.72, species: "Tuber melanosporum", aspect: "S", season: L("Winter", "Invierno"), note: L("Heartland of the black 'diamond' truffle under oak groves.", "Cuna de la trufa negra 'diamante' bajo encinares y robledales.") },
  { id: "borgotaro", name: "Borgotaro", country: "🇮🇹 Italia", lat: 44.49, lng: 9.77, species: "Boletus edulis", aspect: "N", season: L("Late summer–Autumn", "Verano tardío–Otoño"), note: L("PGI porcini of the Apennines — one of Europe's finest cep forests.", "Porcini IGP de los Apeninos — uno de los mejores hayedos de cep de Europa.") },
  { id: "como", name: "Lago di Como", country: "🇮🇹 Italia", lat: 45.92, lng: 9.18, species: "Boletus edulis", aspect: "N", season: L("Autumn", "Otoño"), note: L("Prealpine beech and chestnut woods, your home region in FungiPath.", "Hayedos y castañares prealpinos, tu región base en FungiPath.") },
  { id: "soria", name: "Soria · Pinares", country: "🇪🇸 España", lat: 41.76, lng: -2.46, species: "Boletus edulis", aspect: "N", season: L("Autumn", "Otoño"), note: L("Regulated micological reserves in the pinewoods of Castilla.", "Reservas micológicas reguladas en los pinares de Castilla.") },
  { id: "blackforest", name: "Black Forest", country: "🇩🇪 Alemania", lat: 48.27, lng: 8.20, species: "Cantharellus cibarius", aspect: "O", season: L("Summer–Autumn", "Verano–Otoño"), note: L("Dense conifer forest famed for chanterelles and ceps.", "Bosque denso de coníferas, famoso por rebozuelos y boletos.") },
  { id: "highlands", name: "Scottish Highlands", country: "🏴 Escocia", lat: 57.12, lng: -4.71, species: "Cantharellus cibarius", aspect: "N", season: L("Summer–Autumn", "Verano–Otoño"), note: L("Mossy Caledonian woods rich in chanterelles and hedgehogs.", "Bosques caledonios musgosos ricos en rebozuelos y lengua de gato.") },
  { id: "carpathians", name: "Carpathians", country: "🇷🇴 Rumanía", lat: 45.50, lng: 25.30, species: "Boletus edulis", aspect: "N", season: L("Summer–Autumn", "Verano–Otoño"), note: L("Vast wild forests, a major source of Europe's foraged mushrooms.", "Bosques salvajes inmensos, gran fuente de setas silvestres de Europa.") },
  { id: "lapland", name: "Lapland", country: "🇫🇮 Finlandia", lat: 66.50, lng: 25.73, species: "Cantharellus cibarius", aspect: "S", season: L("Late summer", "Verano tardío"), note: L("Boreal forests with everyman's-right foraging of ceps and chanterelles.", "Bosques boreales con derecho de acceso libre a boletos y rebozuelos.") },
  { id: "oregon", name: "Oregon · Cascades", country: "🇺🇸 EE. UU.", lat: 44.00, lng: -122.00, species: "Cantharellus formosus", aspect: "O", season: L("Autumn–Winter", "Otoño–Invierno"), note: L("Pacific NW rainforest — golden chanterelles and matsutake.", "Selva del Pacífico NW — rebozuelos dorados y matsutake.") },
  { id: "bc", name: "British Columbia", country: "🇨🇦 Canadá", lat: 50.50, lng: -123.50, species: "Tricholoma matsutake", aspect: "N", season: L("Autumn", "Otoño"), note: L("Commercial pine-mushroom (matsutake) harvest in coastal forests.", "Cosecha comercial de matsutake en los bosques costeros.") },
  { id: "nagano", name: "Nagano", country: "🇯🇵 Japón", lat: 36.20, lng: 138.00, species: "Tricholoma matsutake", aspect: "S", season: L("Autumn", "Otoño"), note: L("The prized matsutake of Japanese red-pine forests.", "El preciado matsutake de los pinares rojos japoneses.") },
  { id: "yunnan", name: "Yunnan", country: "🇨🇳 China", lat: 25.50, lng: 100.50, species: "Tricholoma matsutake", aspect: "S", season: L("Summer–Autumn", "Verano–Otoño"), note: L("Biodiverse highlands exporting matsutake and porcini worldwide.", "Mesetas biodiversas que exportan matsutake y porcini al mundo.") },
  { id: "patagonia", name: "Patagonia", country: "🇨🇱 Chile", lat: -41.30, lng: -72.00, species: "Morchella", aspect: "N", season: L("Spring (Oct–Dec)", "Primavera (oct–dic)"), note: L("Andean Nothofagus forests with morels after the burns.", "Bosques andinos de Nothofagus con colmenillas tras las quemas.") },
  { id: "victoria", name: "Victoria", country: "🇦🇺 Australia", lat: -37.50, lng: 145.50, species: "Lactarius deliciosus", aspect: "N", season: L("Autumn (Apr–Jun)", "Otoño (abr–jun)"), note: L("Pine plantations yielding saffron milk caps and slippery jacks.", "Plantaciones de pino con níscalos y boletos anillados.") },
];
