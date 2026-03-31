/** Mismo identificador que `categoryId` en BD y slugs de categoría en el sitio. */
export const PLANTALIA_CATEGORY_SLUGS = [
  'philodendros',
  'alocasias',
  'suculentas',
  'varios',
  'figuras-a-mano',
] as const;

export type PlantaliaCategorySlug = (typeof PLANTALIA_CATEGORY_SLUGS)[number];
