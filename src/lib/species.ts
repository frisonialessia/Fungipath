export type Edibility = "choice" | "edible" | "toxic" | "deadly";

export interface Species {
  n: string; com: string; edib: Edibility; shape: string;
  cap: string; cap2: string; stem?: string; dots?: boolean;
  hab: string; season: string; note: string; twin: string; region: string;
  guide?: {
    harvest: string; dry: string; touch: string; where: string;
    clusters: string; hours: string; aspect: string;
  };
}

export const SPECIES_TOTAL = 128;

export const SPECIES: Species[] = [
  { n: "Boletus edulis", com: "Porcini / Boleto", edib: "choice", shape: "bolete", cap: "#8a4b2a", cap2: "#6d3a20", hab: "Hayedos, robledales", season: "Otoño", note: "Carne blanca que no vira al corte. El rey de los comestibles.", twin: "Tylopilus felleus (amargo)", region: "Europa, Norteamérica",
    guide: { harvest: "Corta o gira suavemente desde la base; no escarbes el micelio.", dry: "Excelente para secar: láminas finas, deshidratar a 40°C.", touch: "Se puede tocar sin riesgo.", where: "En el suelo, bajo hayas, robles y castaños (micorriza).", clusters: "Si encuentras uno, busca alrededor: suele haber más en pocos metros.", hours: "Mejor a primera hora, tras noches húmedas.", aspect: "Sobre el suelo, nunca enterrado. Busca el sombrero entre la hojarasca." } },
  { n: "Cantharellus cibarius", com: "Rebozuelo", edib: "choice", shape: "chanterelle", cap: "#d29a3e", cap2: "#b07d28", hab: "Coníferas y caducifolios", season: "Verano-Otoño", note: "Amarillo yema, olor afrutado, falsos pliegues.", twin: "Hygrophoropsis aurantiaca", region: "Europa",
    guide: { harvest: "Corta con navaja a ras de suelo para no dañar el micelio.", dry: "Mejor en conserva o congelado; al secar pierde aroma.", touch: "Sin riesgo al tacto.", where: "Suelo de bosques, entre musgo.", clusters: "Crece en grupos: si ves uno, casi siempre hay una colonia.", hours: "Cualquier hora; más visibles con luz lateral de la mañana.", aspect: "Sobre el suelo, a veces semi-oculto entre musgo." } },
  { n: "Lactarius deliciosus", com: "Níscalo / Rovellón", edib: "choice", shape: "bolete", cap: "#c97a3c", cap2: "#a65f28", hab: "Pinares", season: "Otoño", note: "Látex anaranjado, vira a verde (normal).", twin: "Lactarius torminosus", region: "España, sur de Europa",
    guide: { harvest: "Gira y tira con cuidado; revisa que no tenga gusanos en el pie.", dry: "No ideal para secar; mejor en aceite o a la brasa.", touch: "Sin riesgo; mancha los dedos de naranja (normal).", where: "Suelo de pinares, en zonas de pasto bajo pinos.", clusters: "Aparece en grupos dispersos; rastrea el pinar.", hours: "Mañana, tras lluvias de otoño.", aspect: "Sobre el suelo, el sombrero a veces apenas asoma." } },
  { n: "Tuber melanosporum", com: "Trufa negra", edib: "choice", shape: "puffball", cap: "#2e231b", cap2: "#1a1410", hab: "Encinares (subterránea)", season: "Invierno", note: "Hipogea, aroma intenso. Se busca con perro.", twin: "Trufas sin aroma", region: "Francia, España, Italia",
    guide: { harvest: "Se extrae con perro adiestrado y herramienta; es subterránea.", dry: "No se seca; se usa fresca o conservada en frío.", touch: "Sin riesgo.", where: "ENTERRADA, junto a raíces de encina y roble (5-30 cm).", clusters: "Las truferas producen varias en la misma zona año tras año.", hours: "Temporada invernal; búsqueda por olfato del perro.", aspect: "Bajo tierra: no se ve en superficie, solo se huele." } },
  { n: "Morchella esculenta", com: "Colmenilla", edib: "choice", shape: "morel", cap: "#a8895c", cap2: "#7d6440", hab: "Riberas, fresnedas", season: "Primavera", note: "Cabeza alveolada, hueca. Tóxica cruda, comestible cocinada.", twin: "Gyromitra (falsa colmenilla)", region: "Europa, Norteamérica",
    guide: { harvest: "Corta a ras de suelo; hueca por dentro (señal de autenticidad).", dry: "Excelente seca; intensifica el sabor.", touch: "Sin riesgo, pero SIEMPRE cocinar (tóxica cruda).", where: "Suelo de riberas, fresnedas, zonas quemadas el año anterior.", clusters: "Suele salir en grupos; revisa bien el entorno.", hours: "Primavera, tras días templados y húmedos.", aspect: "Sobre el suelo, camuflada con la hojarasca." } },
  { n: "Craterellus cornucopioides", com: "Trompeta de los muertos", edib: "edible", shape: "trumpet", cap: "#3a322b", cap2: "#2e231b", hab: "Hayedos, robledales", season: "Otoño", note: "Negra y hueca, excelente seca.", twin: "Sin sosias peligrosos", region: "Francia, Italia" },
  { n: "Amanita caesarea", com: "Oronja", edib: "choice", shape: "amanita", cap: "#e0741f", cap2: "#b85a14", stem: "#f2d96b", dots: false, hab: "Encinares, castañares", season: "Verano-Otoño", note: "Naranja, láminas y pie amarillos, volva blanca.", twin: "Amanita muscaria", region: "Italia, España" },
  { n: "Pleurotus ostreatus", com: "Seta de ostra", edib: "edible", shape: "oyster", cap: "#c9c0ad", cap2: "#9c9283", hab: "Troncos caducos", season: "Otoño-Invierno", note: "Crece en repisas, láminas decurrentes.", twin: "Omphalotus (bioluminiscente)", region: "Mundial" },
  { n: "Macrolepiota procera", com: "Parasol", edib: "edible", shape: "parasol", cap: "#b09372", cap2: "#7d6448", hab: "Prados, claros", season: "Otoño", note: "Escamas, anillo doble móvil. Solo el sombrero.", twin: "Chlorophyllum", region: "Europa" },
  { n: "Amanita muscaria", com: "Matamoscas", edib: "toxic", shape: "amanita", cap: "#c8341f", cap2: "#a02816", hab: "Abedules, pinos", season: "Otoño", note: "Roja con motas blancas. Psicoactiva y tóxica.", twin: "A. caesarea (comestible)", region: "Mundial" },
  { n: "Amanita phalloides", com: "Oronja verde", edib: "deadly", shape: "amanita", cap: "#9aa86b", cap2: "#7a8a4e", dots: false, hab: "Robledales, hayedos", season: "Otoño", note: "Causa la mayoría de muertes. Sombrero verdoso, volva.", twin: "Agaricus, Amanita comestibles", region: "Mundial" },
  { n: "Gyromitra esculenta", com: "Falsa colmenilla", edib: "deadly", shape: "morel", cap: "#7a3a20", cap2: "#5a2414", hab: "Pinares arenosos", season: "Primavera", note: "Cerebriforme, no alveolada. Tóxica letal.", twin: "Colmenilla verdadera", region: "Europa, Norteamérica" },
];
