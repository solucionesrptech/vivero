/** Slugs alineados con `PLANTALIA_CATEGORY_SLUGS` del API Nest. */
export const PLANTALIA_CATEGORY_SLUGS = [
  "philodendros",
  "alocasias",
  "suculentas",
  "varios",
  "figuras-a-mano",
] as const;

export type PlantaliaCategorySlug = (typeof PLANTALIA_CATEGORY_SLUGS)[number];

export type CategoryId = PlantaliaCategorySlug;

export type CategoryCard = {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

const u = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const categories: CategoryCard[] = [
  {
    id: "philodendros",
    name: "Philodendros",
    slug: "philodendros",
    description:
      "Hojas generosas y formas esculturales para espacios con luz filtrada.",
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
    description:
      "Formas compactas, fáciles de cuidar y perfectas para rincones soleados.",
    imageSrc: u("1459411552884-841db9b3cc2a", 800),
    imageAlt: "Variedad de suculentas en arreglo minimalista",
  },
  {
    id: "varios",
    name: "Varios",
    slug: "varios",
    description:
      "Selección curada: complementos, rarezas y piezas que suman carácter.",
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

export function getCategoryBySlug(slug: string): CategoryCard | undefined {
  return categories.find((c) => c.slug === slug);
}

export function isValidCategorySlug(slug: string): slug is CategoryId {
  return categories.some((c) => c.slug === slug);
}

/** Opciones para `<select>` admin: slug = valor enviado al API (`category`). */
export const adminCategorySelectOptions: { slug: PlantaliaCategorySlug; label: string }[] =
  categories.map((c) => ({ slug: c.id, label: c.name }));
