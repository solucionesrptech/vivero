import type { CategoryId } from "@/lib/constants/plantalia-categories";
import { isValidCategorySlug } from "@/lib/constants/plantalia-categories";
import type { CatalogProduct } from "@/lib/types/catalog-product";
import type { ProductApiDto } from "@/lib/types/product-api";

function formatPriceLabel(clp: number): string {
  return `$${clp.toLocaleString("es-CL")}`;
}

/**
 * Convierte un DTO del API a `CatalogProduct`. Devuelve null si la categoría no es reconocida.
 */
export function mapProductApiToCatalogProduct(dto: ProductApiDto): CatalogProduct | null {
  if (!isValidCategorySlug(dto.categoryId)) {
    return null;
  }
  const stock = dto.stock;
  const isAvailable = stock > 0;
  return {
    id: dto.id,
    slug: dto.slug,
    categoryId: dto.categoryId as CategoryId,
    name: dto.name,
    description: dto.description,
    shortDescription: dto.shortDescription,
    price: dto.price,
    priceLabel: formatPriceLabel(dto.price),
    imageSrc: dto.imageSrc,
    imageAlt: dto.imageAlt,
    isAvailable,
    stock,
  };
}
