/** Fila de catálogo devuelta por el DAL (sin tipos de Prisma hacia capas superiores). */

export type ProductCatalogRow = {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  stock: number;
};
