import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const u = (id, w) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const rows = [
  ["p1", "philodendron-brasil", "philodendros", "Philodendron Brasil", "Luz indirecta; enredadera generosa y fácil de cuidar.", "Ideal para estantes altos o macetas colgantes. Tolera bien el riego moderado y se adapta a interiores luminosos.", 12000, u("1614594975525-e45190c55d0b", 600), "Philodendron Brasil", 12],
  ["p2", "philodendron-birkin", "philodendros", "Philodendron Birkin", "Rayas crema sobre verde; compacto y elegante.", "Prefiere sustrato bien drenado y riego cuando el sustrato seca ligeramente.", 18500, u("1614594975525-e45190c55d0b", 600), "Philodendron Birkin", 4],
  ["p3", "philodendron-micans", "philodendros", "Philodendron Micans", "Hojas aterciopeladas con tonos bronce.", "Perfecto para rincones con buena luz filtrada; evitar sol directo fuerte.", 14500, u("1614594975525-e45190c55d0b", 600), "Philodendron Micans", 8],
  ["p4", "philodendron-prince-orange", "philodendros", "Philodendron Prince of Orange", "Nuevas hojas en tonos naranja que maduran a verde.", "Una pieza llamativa para mesas bajas o aparadores cerca de ventanas.", 22000, u("1614594975525-e45190c55d0b", 600), "Philodendron Prince of Orange", 0],
  ["p5", "philodendron-silver-sword", "philodendros", "Philodendron Silver Sword", "Follaje plateado en forma de lanza.", "Le gusta la humedad ambiental y un riego uniforme sin encharcar.", 19800, u("1614594975525-e45190c55d0b", 600), "Philodendron Silver Sword", 3],
  ["p6", "philodendron-caramel-marble", "philodendros", "Philodendron Caramel Marble", "Variegación cálida; pieza de colección.", "Recomendamos ubicación estable y agua sin exceso de minerales.", 28900, u("1614594975525-e45190c55d0b", 600), "Philodendron Caramel Marble", 2],
  ["a1", "alocasia-polly", "alocasias", "Alocasia Polly", "Nervaduras marcadas y porte compacto.", "Ideal para interiores húmedos; evitar corrientes frías y riego encharcado.", 18000, u("1599599810769-bcde5a160d32", 600), "Alocasia Polly", 10],
  ["a2", "alocasia-amazonica", "alocasias", "Alocasia Amazonica", "Hojas esculpidas con bordes definidos.", "Prefiere luz brillante indirecta y sustrato que no permanezca empapado.", 21000, u("1599599810769-bcde5a160d32", 600), "Alocasia Amazonica", 6],
  ["a3", "alocasia-silver-dragon", "alocasias", "Alocasia Silver Dragon", "Textura plateada y porte denso.", "Mantener alejada del sol directo; pulverizar en ambientes secos.", 24500, u("1599599810769-bcde5a160d32", 600), "Alocasia Silver Dragon", 5],
  ["a4", "alocasia-zebrina", "alocasias", "Alocasia Zebrina", "Tallos rayados que aportan contraste.", "Combina bien con macetas altas; vigilar trips en hojas nuevas.", 19500, u("1599599810769-bcde5a160d32", 600), "Alocasia Zebrina", 0],
  ["a5", "alocasia-cuprea", "alocasias", "Alocasia Cuprea", "Tonos cobrizos en hojas nuevas.", "Planta de mirada; ubicar en espacio con buena luz y aire suave.", 26800, u("1599599810769-bcde5a160d32", 600), "Alocasia Cuprea", 2],
  ["a6", "alocasia-frydek", "alocasias", "Alocasia Frydek", "Verde profundo con nervadura clara.", "Aprecia humedad y temperaturas estables; ideal para salas luminosas.", 23200, u("1599599810769-bcde5a160d32", 600), "Alocasia Frydek", 7],
  ["s1", "echeveria-elegans", "suculentas", "Echeveria elegans", "Roseta compacta y bajo riego.", "Mucha luz y riego escaso; ideal para alféizares soleados.", 5500, u("1512428559087-560fa5ceab42", 600), "Echeveria elegans", 24],
  ["s2", "haworthia-fasciata", "suculentas", "Haworthia fasciata", "Rayas blancas en hojas en roseta.", "Perfecta para escritorios con luz indirecta; evitar exceso de agua.", 4800, u("1459411552884-841db9b3cc2a", 600), "Haworthia fasciata", 18],
  ["s3", "sedum-morganianum", "suculentas", "Sedum morganianum", "Cola de burro en cascada.", "Colgar en macetas altas; proteger de heladas y riego moderado.", 8900, u("1459411552884-841db9b3cc2a", 600), "Sedum morganianum", 9],
  ["s4", "graptopetalum-paraguayense", "suculentas", "Graptopetalum paraguayense", "Tonos lavanda en pleno sol.", "Sustrato muy drenado; trasplante en primavera si es necesario.", 6200, u("1512428559087-560fa5ceab42", 600), "Graptopetalum paraguayense", 15],
  ["s5", "lithops-mix", "suculentas", "Lithops (mix)", "Piedras vivas; riego muy esporádico.", "Para coleccionistas; ciclo de riego según estación y sustrato mineral.", 7500, u("1459411552884-841db9b3cc2a", 600), "Lithops", 0],
  ["s6", "crassula-ovata", "suculentas", "Crassula ovata", "Árbol de jade resistente y simbólico.", "Tolera olvidos de riego; poda ligera para mantener forma compacta.", 9900, u("1512428559087-560fa5ceab42", 600), "Crassula ovata", 11],
  ["v1", "monstera-deliciosa", "varios", "Monstera deliciosa", "Clásico de interior con hojas perforadas.", "Escala con tutor o deja caer en espacios amplios con luz filtrada.", 22000, u("1485955900006-10f4d324d411", 600), "Monstera deliciosa", 6],
  ["v2", "calathea-orbifolia", "varios", "Calathea orbifolia", "Hojas redondas con rayas plateadas.", "Agradece humedad ambiental; agua sin cal excesivo.", 16000, u("1599599810769-bcde5a160d32", 600), "Calathea orbifolia", 4],
  ["v3", "ficus-lyrata", "varios", "Ficus lyrata", "Hojas grandes tipo violín.", "Ubicación estable; evitar mudanzas frecuentes de maceta.", 35000, u("1485955900006-10f4d324d411", 600), "Ficus lyrata", 3],
  ["v4", "pilea-peperomioides", "varios", "Pilea peperomioides", "Forma redonda y propagación sencilla.", "Ideal para mesas de luz indirecta; comparte esquejes fácilmente.", 8900, u("1485955900006-10f4d324d411", 600), "Pilea peperomioides", 14],
  ["v5", "spathiphyllum", "varios", "Spathiphyllum", "Flores blancas y buena tolerancia a sombra.", "Indicador de sed; riego cuando el sustrato pierde humedad superficial.", 11000, u("1485955900006-10f4d324d411", 600), "Spathiphyllum", 0],
  ["v6", "zamioculcas-zamiifolia", "varios", "Zamioculcas zamiifolia", "ZZ: resistente y de bajo mantenimiento.", "Perfecta para oficinas; riego escaso y luz media.", 13500, u("1485955900006-10f4d324d411", 600), "Zamioculcas", 20],
  ["f1", "figura-ceramica-maceta", "figuras-a-mano", "Figura cerámica para maceta", "Detalle artesanal esmaltado.", "Combina con macetas de barro o cerámica; pieza decorativa liviana.", 9500, u("1610701596007-11502861dcfa", 600), "Figura cerámica para maceta", 8],
  ["f2", "adorno-rustico-jardin", "figuras-a-mano", "Adorno rústico de jardín", "Textura natural para rincones verdes.", "Pensado para exteriores cubiertos o terrazas; evitar golpes fuertes.", 12000, u("1565193566173-7a0ee3dbe261", 600), "Adorno rústico de jardín", 5],
  ["f3", "mini-duende-ceramica", "figuras-a-mano", "Mini duende cerámica", "Pieza pequeña para maceteros.", "Hecho a mano; variaciones de color son parte del proceso.", 7800, u("1610701596007-11502861dcfa", 600), "Mini duende cerámica", 12],
  ["f4", "marcador-plantas-madera", "figuras-a-mano", "Marcador de plantas (madera)", "Set con grabado simple.", "Tratar ocasionalmente con aceite de teca si se usa en exterior.", 4500, u("1565193566173-7a0ee3dbe261", 600), "Marcadores de madera", 30],
  ["f5", "cuelga-macramé-natural", "figuras-a-mano", "Cuelga macramé natural", "Soporte trenzado para macetas pequeñas.", "Fibra de algodón; revisar capacidad de peso según maceta.", 14200, u("1565193566173-7a0ee3dbe261", 600), "Macramé para maceta", 0],
  ["f6", "bandeja-barro-pintado", "figuras-a-mano", "Bandeja de barro pintado", "Base para agrupar macetas o hidratar desde abajo.", "Acabado mate; limpiar con paño húmedo sin abrasivos.", 16800, u("1610701596007-11502861dcfa", 600), "Bandeja de barro", 4],
  ["pg1", "pothos-golden", "philodendros", "Pothos golden", "Resistente y versátil; perfecto para empezar.", "Resistente y versátil; perfecto para empezar.", 8000, u("1459411552884-841db9b3cc2a", 600), "Pothos golden", 15],
];

const out = rows.map(
  ([id, slug, categoryId, name, shortDescription, description, price, imageSrc, imageAlt, stock]) => ({
    id,
    slug,
    categoryId,
    name,
    shortDescription,
    description,
    price,
    imageSrc,
    imageAlt,
    stock,
  }),
);

const root = dirname(fileURLToPath(import.meta.url));
const target = join(root, "..", "prisma", "catalog-seed.json");
writeFileSync(target, JSON.stringify(out, null, 2), "utf8");
console.log("wrote", target, out.length);
