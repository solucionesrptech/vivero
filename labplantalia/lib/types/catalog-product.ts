import type { CategoryId } from "@/lib/constants/plantalia-categories";

/**
 * Producto de catálogo (listo para mapear desde API).
 * Campos alineados con futuro backend: id, slug, category, name, description, price, image, disponibilidad/stock.
 */
export type CatalogProduct = {
  id: string;
  slug: string;
  categoryId: CategoryId;
  name: string;
  /** Descripción larga (detalle / modal). */
  description: string;
  /** Texto breve en card. */
  shortDescription: string;
  /** Precio en pesos CLP (entero). */
  price: number;
  /** Etiqueta ya formateada para UI. */
  priceLabel: string;
  imageSrc: string;
  imageAlt: string;
  /** Disponible para venta (API: ej. stock > 0 o flag). */
  isAvailable: boolean;
  /** Unidades; null si no aplica o ilimitado en mock. */
  stock: number | null;
};
