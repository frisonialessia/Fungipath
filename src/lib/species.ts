export type Edibility = "choice" | "edible" | "caution" | "toxic" | "deadly";
export type Shape =
  | "bolete" | "amanita" | "chanterelle" | "morel"
  | "oyster" | "parasol" | "puffball" | "trumpet" | "coral";

export interface Species {
  n: string;        // nombre científico
  com: string;      // nombre común
  edib: Edibility;
  el: string;       // etiqueta de comestibilidad en español
  shape: Shape;
  cap: string;      // color principal del sombrero
  cap2?: string;    // color secundario
  stem?: string;    // color del pie
  dots?: boolean;
  hab: string;      // hábitat
  season: string;
  note: string;     // identificación
  twin: string;     // posible confusión / sosias
  region: string;
}

export interface FieldGuide {
  harvest: string; dry: string; touch: string; where: string;
  clusters: string; hours: string; aspect: string;
}

export const SPECIES_TOTAL = 128;

// Catálogo ilustrado (24 de 128+). Portado de fungipath-app-v4.
export const SPECIES: Species[] = [
  { n: "Boletus edulis", com: "Porcini / Boleto", edib: "choice", el: "Excelente", shape: "bolete", cap: "#8a4b2a", cap2: "#6d3a20", hab: "Hayedos, robledales", season: "Otoño", note: "Carne blanca que no vira al corte. El rey de los comestibles.", twin: "Tylopilus felleus (amargo)", region: "Europa, Norteamérica" },
  { n: "Boletus aereus", com: "Boleto negro", edib: "choice", el: "Excelente", shape: "bolete", cap: "#4a3526", cap2: "#33241a", hab: "Encinares, alcornocales", season: "Otoño", note: "Sombrero pardo muy oscuro, superior al edulis para muchos.", twin: "Tylopilus felleus", region: "Mediterráneo" },
  { n: "Boletus pinophilus", com: "Boleto de pino", edib: "choice", el: "Excelente", shape: "bolete", cap: "#7a3b22", cap2: "#5a2c18", hab: "Pinares", season: "Otoño", note: "Tonos rojizos, asociado a coníferas.", twin: "Tylopilus felleus", region: "Europa" },
  { n: "Cantharellus cibarius", com: "Rebozuelo", edib: "choice", el: "Excelente", shape: "chanterelle", cap: "#d29a3e", cap2: "#b07d28", hab: "Coníferas y caducifolios", season: "Verano-Otoño", note: "Amarillo yema, olor afrutado, falsos pliegues.", twin: "Hygrophoropsis aurantiaca", region: "Europa" },
  { n: "Craterellus cornucopioides", com: "Trompeta de los muertos", edib: "edible", el: "Comestible", shape: "trumpet", cap: "#3a322b", cap2: "#2e231b", hab: "Hayedos, robledales", season: "Otoño", note: "Negra y hueca, excelente seca.", twin: "Sin sosias peligrosos", region: "Francia, Italia" },
  { n: "Lactarius deliciosus", com: "Níscalo / Rovellón", edib: "choice", el: "Excelente", shape: "bolete", cap: "#c97a3c", cap2: "#a65f28", hab: "Pinares", season: "Otoño", note: "Látex anaranjado, vira a verde (normal).", twin: "Lactarius torminosus", region: "España, sur de Europa" },
  { n: "Amanita caesarea", com: "Oronja", edib: "choice", el: "Excelente", shape: "amanita", cap: "#e0741f", cap2: "#b85a14", stem: "#f2d96b", dots: false, hab: "Encinares, castañares", season: "Verano-Otoño", note: "Naranja, láminas y pie amarillos, volva blanca.", twin: "Amanita muscaria", region: "Italia, España" },
  { n: "Morchella esculenta", com: "Colmenilla", edib: "choice", el: "Excelente", shape: "morel", cap: "#a8895c", cap2: "#7d6440", hab: "Riberas, fresnedas", season: "Primavera", note: "Cabeza alveolada, hueca. Tóxica cruda, comestible cocinada.", twin: "Gyromitra (falsa colmenilla)", region: "Europa, Norteamérica" },
  { n: "Calocybe gambosa", com: "Seta de San Jorge", edib: "choice", el: "Excelente", shape: "bolete", cap: "#e6dcc4", cap2: "#cbbf9e", hab: "Prados, setos", season: "Primavera", note: "Carnosa, blanca, olor a harina fresca.", twin: "Entoloma lividum", region: "Norte de España" },
  { n: "Pleurotus ostreatus", com: "Seta de ostra", edib: "edible", el: "Comestible", shape: "oyster", cap: "#c9c0ad", cap2: "#9c9283", hab: "Troncos caducos", season: "Otoño-Invierno", note: "Crece en repisas, láminas decurrentes.", twin: "Omphalotus (bioluminiscente)", region: "Mundial" },
  { n: "Macrolepiota procera", com: "Parasol", edib: "edible", el: "Comestible", shape: "parasol", cap: "#b09372", cap2: "#7d6448", hab: "Prados, claros", season: "Otoño", note: "Escamas, anillo doble móvil. Solo el sombrero.", twin: "Chlorophyllum", region: "Europa" },
  { n: "Hydnum repandum", com: "Lengua de gato", edib: "edible", el: "Comestible", shape: "bolete", cap: "#d9b87e", cap2: "#bd9a5e", hab: "Bosques mixtos", season: "Otoño", note: "Aguijones en vez de láminas. Inconfundible.", twin: "Sin sosias peligrosos", region: "Europa" },
  { n: "Agaricus campestris", com: "Champiñón silvestre", edib: "edible", el: "Comestible", shape: "bolete", cap: "#e8ddd0", cap2: "#c9b79c", hab: "Prados, pastos", season: "Otoño", note: "Láminas rosas a marrón chocolate.", twin: "Amanita (MORTAL)", region: "Mundial" },
  { n: "Ramaria botrytis", com: "Manita / Coral", edib: "edible", el: "Comestible", shape: "coral", cap: "#d9a679", cap2: "#b8855a", stem: "#e8dccd", hab: "Bosques mixtos", season: "Otoño", note: "Forma de coral, puntas rosadas.", twin: "Ramaria formosa (laxante)", region: "Europa" },
  { n: "Cantharellus tubaeformis", com: "Trompeta amarilla", edib: "edible", el: "Comestible", shape: "chanterelle", cap: "#c89a4e", cap2: "#a07a30", hab: "Coníferas musgosas", season: "Otoño tardío", note: "Pie hueco amarillo, crece en grupos.", twin: "Sin sosias peligrosos", region: "Europa" },
  { n: "Lactarius sanguifluus", com: "Níscalo de sangre", edib: "choice", el: "Excelente", shape: "bolete", cap: "#b85a4a", cap2: "#963f30", hab: "Pinares calizos", season: "Otoño", note: "Látex rojo vino. Muy apreciado.", twin: "Otros Lactarius", region: "Mediterráneo" },
  { n: "Tuber melanosporum", com: "Trufa negra", edib: "choice", el: "Excelente", shape: "puffball", cap: "#2e231b", cap2: "#1a1410", hab: "Encinares (subterránea)", season: "Invierno", note: "Hipogea, aroma intenso. Se busca con perro.", twin: "Trufas sin aroma", region: "Francia, España, Italia" },
  { n: "Agaricus bisporus", com: "Champiñón común", edib: "edible", el: "Comestible", shape: "bolete", cap: "#e0d2c0", cap2: "#c2b09a", hab: "Cultivado / prados", season: "Todo el año", note: "El champiñón de mercado, también silvestre.", twin: "Amanita blanca", region: "Mundial" },
  { n: "Amanita muscaria", com: "Matamoscas", edib: "toxic", el: "Tóxica", shape: "amanita", cap: "#c8341f", cap2: "#a02816", hab: "Abedules, pinos", season: "Otoño", note: "Roja con motas blancas. Psicoactiva y tóxica.", twin: "A. caesarea (comestible)", region: "Mundial" },
  { n: "Amanita pantherina", com: "Amanita pantera", edib: "toxic", el: "Tóxica", shape: "amanita", cap: "#9a7048", cap2: "#7a5636", hab: "Bosques mixtos", season: "Otoño", note: "Parda con motas blancas. Neurotóxica.", twin: "Amanita rubescens", region: "Europa" },
  { n: "Amanita phalloides", com: "Oronja verde", edib: "deadly", el: "MORTAL", shape: "amanita", cap: "#9aa86b", cap2: "#7a8a4e", dots: false, hab: "Robledales, hayedos", season: "Otoño", note: "Causa la mayoría de muertes. Sombrero verdoso, volva.", twin: "Agaricus, Amanita comestibles", region: "Mundial" },
  { n: "Galerina marginata", com: "Galerina mortal", edib: "deadly", el: "MORTAL", shape: "bolete", cap: "#a06b3a", cap2: "#7d5028", hab: "Madera muerta", season: "Otoño", note: "Pequeña, marrón. Mismas toxinas que la phalloides.", twin: "Setas de tocón comestibles", region: "Mundial" },
  { n: "Cortinarius rubellus", com: "Cortinario mortal", edib: "deadly", el: "MORTAL", shape: "bolete", cap: "#9a4a26", cap2: "#7a3618", hab: "Coníferas húmedas", season: "Otoño", note: "Daño renal tardío (días después).", twin: "Rebozuelos por color", region: "Europa" },
  { n: "Gyromitra esculenta", com: "Falsa colmenilla", edib: "deadly", el: "MORTAL", shape: "morel", cap: "#7a3a20", cap2: "#5a2414", hab: "Pinares arenosos", season: "Primavera", note: "Cerebriforme, no alveolada. Tóxica letal.", twin: "Colmenilla verdadera", region: "Europa, Norteamérica" },
];

// Guía de campo por especie (datos de cosecha). Portado de FIELD_GUIDE.
export const FIELD_GUIDE: Record<string, FieldGuide> = {
  "Boletus edulis": { harvest: "Corta o gira suavemente desde la base; no escarbes el micelio.", dry: "Excelente para secar: láminas finas, deshidratar a 40°C.", touch: "Se puede tocar sin riesgo.", where: "En el suelo, bajo hayas, robles y castaños (micorriza).", clusters: "Si encuentras uno, busca alrededor: suele haber más en un radio de pocos metros.", hours: "Mejor a primera hora de la mañana, tras noches húmedas.", aspect: "Sobre el suelo, nunca enterrado. Busca el sombrero entre la hojarasca." },
  "Cantharellus cibarius": { harvest: "Corta con navaja a ras de suelo para no dañar el micelio.", dry: "Mejor en conserva o congelado; al secar pierde aroma.", touch: "Sin riesgo al tacto.", where: "Suelo de bosques de coníferas y caducifolios, entre musgo.", clusters: "Crece en grupos: si ves uno, casi siempre hay una colonia.", hours: "Cualquier hora; más visibles con luz lateral de la mañana.", aspect: "Sobre el suelo, a veces semi-oculto entre musgo y hojas." },
  "Lactarius deliciosus": { harvest: "Gira y tira con cuidado; revisa que no tenga gusanos en el pie.", dry: "No ideal para secar; mejor en aceite o a la brasa.", touch: "Sin riesgo; mancha los dedos de naranja (normal).", where: "Suelo de pinares, a menudo en zonas de pasto bajo pinos.", clusters: "Aparece en grupos dispersos; rastrea la zona del pinar.", hours: "Mañana, tras lluvias de otoño.", aspect: "Sobre el suelo, el sombrero a veces apenas asoma." },
  "Tuber melanosporum": { harvest: "Se extrae con perro adiestrado y herramienta; es subterránea.", dry: "No se seca; se usa fresca o conservada en frío.", touch: "Sin riesgo.", where: "ENTERRADA, junto a raíces de encina y roble (5-30 cm).", clusters: "Las truferas producen varias en la misma zona año tras año.", hours: "Temporada invernal; la búsqueda es por olfato del perro.", aspect: "Bajo tierra: imposible verla en superficie, solo se huele." },
  "Morchella esculenta": { harvest: "Corta a ras de suelo; hueca por dentro (señal de autenticidad).", dry: "Excelente seca; intensifica el sabor.", touch: "Sin riesgo, pero SIEMPRE cocinar (tóxica cruda).", where: "Suelo de riberas, fresnedas, zonas quemadas el año anterior.", clusters: "Suele salir en grupos; revisa bien el entorno.", hours: "Primavera, tras días templados y húmedos.", aspect: "Sobre el suelo, camuflada: su color se confunde con hojarasca." },
};
