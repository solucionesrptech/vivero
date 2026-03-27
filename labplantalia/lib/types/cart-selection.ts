import type { CatalogProduct } from "@/lib/types/catalog-product";

/** Línea lista para enviar al carrito (mock o API). */
export type CartLineDraft = {
  productId: string;
  quantity: number;
  product: CatalogProduct;
};
