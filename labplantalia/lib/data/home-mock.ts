export type CategoryId =
  | "philodendros"
  | "alocasias"
  | "suculentas"
  | "varios"
  | "figuras-a-mano";

export type CategoryCard = {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

export type FeaturedProduct = {
  id: string;
  name: string;
  slug: string;
  categoryId: CategoryId;
  categoryName: string;
  priceLabel: string;
  imageSrc: string;
  imageAlt: string;
  shortDescription: string;
};

/** IDs de Unsplash verificados (evitar 404 por fotos retiradas). */
const u = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const categories: CategoryCard[] = [
  {
    id: "philodendros",
    name: "Philodendros",
    slug: "philodendros",
    description: "Hojas generosas y formas esculturales para espacios con luz filtrada.",
    imageSrc: u("1614594975525-e45190c55d0b", 800),
    imageAlt: "Philodendron con hojas verdes en interior luminoso",
  },
  {
    id: "alocasias",
    name: "Alocasias",
    slug: "alocasias",
    description: "Texturas marcadas y presencia tropical con un aire sofisticado.",
    imageSrc: u("1599599810769-bcde5a160d32", 800),
    imageAlt: "Alocasia con hojas grandes en maceta",
  },
  {
    id: "suculentas",
    name: "Suculentas",
    slug: "suculentas",
    description: "Formas compactas, fáciles de cuidar y perfectas para rincones soleados.",
    imageSrc: u("1459411552884-841db9b3cc2a", 800),
    imageAlt: "Variedad de suculentas en arreglo minimalista",
  },
  {
    id: "varios",
    name: "Varios",
    slug: "varios",
    description: "Selección curada: complementos, rarezas y piezas que suman carácter.",
    imageSrc: u("1485955900006-10f4d324d411", 800),
    imageAlt: "Plantas de interior en estantería de madera",
  },
  {
    id: "figuras-a-mano",
    name: "Figuras a mano",
    slug: "figuras-a-mano",
    description:
      "Piezas únicas y detalles artesanales para personalizar macetas y rincones verdes.",
    imageSrc: u("1610701596007-11502861dcfa", 800),
    imageAlt: "Cerámica y piezas decorativas hechas a mano junto a plantas",
  },
];

export const featuredProducts: FeaturedProduct[] = [
  {
    id: "p1",
    name: "Philodendron Brasil",
    slug: "philodendron-brasil",
    categoryId: "philodendros",
    categoryName: "Philodendros",
    priceLabel: "Desde $12.000",
    imageSrc: u("1614594975525-e45190c55d0b", 600),
    imageAlt: "Philodendron Brasil en maceta colgante",
    shortDescription: "Enredadera amable, ideal para estantes altos y luz indirecta.",
  },
  {
    id: "a1",
    name: "Alocasia Polly",
    slug: "alocasia-polly",
    categoryId: "alocasias",
    categoryName: "Alocasias",
    priceLabel: "Desde $18.000",
    imageSrc: u("1599599810769-bcde5a160d32", 600),
    imageAlt: "Alocasia con nervaduras contrastadas",
    shortDescription: "Hojas con nervadura marcada; un punto focal en cualquier ambiente.",
  },
  {
    id: "s1",
    name: "Echeveria elegans",
    slug: "echeveria-elegans",
    categoryId: "suculentas",
    categoryName: "Suculentas",
    priceLabel: "Desde $5.500",
    imageSrc: u("1512428559087-560fa5ceab42", 600),
    imageAlt: "Echeveria en maceta de cerámica",
    shortDescription: "Roseta compacta, bajo riego y mucha luz.",
  },
  {
    id: "v1",
    name: "Monstera deliciosa",
    slug: "monstera-deliciosa",
    categoryId: "varios",
    categoryName: "Varios",
    priceLabel: "Desde $22.000",
    imageSrc: u("1485955900006-10f4d324d411", 600),
    imageAlt: "Monstera con hojas perforadas",
    shortDescription: "Clásico atemporal; crece con personalidad en espacios amplios.",
  },
  {
    id: "v2",
    name: "Calathea orbifolia",
    slug: "calathea-orbifolia",
    categoryId: "varios",
    categoryName: "Varios",
    priceLabel: "Desde $16.000",
    imageSrc: u("1599599810769-bcde5a160d32", 600),
    imageAlt: "Calathea con hojas redondas rayadas",
    shortDescription: "Follaje redondeado con rayas plateadas; ama la humedad ambiental.",
  },
  {
    id: "pg1",
    name: "Pothos golden",
    slug: "pothos-golden",
    categoryId: "philodendros",
    categoryName: "Philodendros",
    priceLabel: "Desde $8.000",
    imageSrc: u("1459411552884-841db9b3cc2a", 600),
    imageAlt: "Pothos con hojas variegadas",
    shortDescription: "Resistente y versátil; perfecto para empezar.",
  },
  {
    id: "f1",
    name: "Figura cerámica para maceta",
    slug: "figura-ceramica-maceta",
    categoryId: "figuras-a-mano",
    categoryName: "Figuras a mano",
    priceLabel: "Desde $9.500",
    imageSrc: u("1610701596007-11502861dcfa", 600),
    imageAlt: "Pequeñas figuras de cerámica junto a plantas en maceta",
    shortDescription:
      "Detalle artesanal que acompaña tus plantas sin restar protagonismo al follaje.",
  },
  {
    id: "f2",
    name: "Adorno rústico de jardín",
    slug: "adorno-rustico-jardin",
    categoryId: "figuras-a-mano",
    categoryName: "Figuras a mano",
    priceLabel: "Desde $12.000",
    imageSrc: u("1565193566173-7a0ee3dbe261", 600),
    imageAlt: "Adorno decorativo de jardín entre macetas y piedras",
    shortDescription:
      "Pieza con acabado natural; ideal para terrazas, balcones o rincones con plantas.",
  },
];

export const heroBackgroundSrc = "/img/hero/hero.jpeg";
