/** Respuesta de GET /products (alineada con ProductResponseDto del API). */

export type ProductApiDto = {
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
