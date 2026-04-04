import type { CategoryId } from "@/lib/constants/plantalia-categories";
import { categories, isValidCategorySlug } from "@/lib/constants/plantalia-categories";
import type { FeaturedProduct } from "@/lib/data/home-mock";
import type { ProductApiDto } from "@/lib/types/product-api";

function formatPriceLabel(clp: number): string {
  return `$${clp.toLocaleString("es-CL")}`;
}

export function mapProductApiToFeaturedProduct(dto: ProductApiDto): FeaturedProduct | null {
  if (!isValidCategorySlug(dto.categoryId)) {
    return null;
  }
  const cat = categories.find((c) => c.slug === dto.categoryId);
  const categoryName = cat?.name ?? dto.categoryId;
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    categoryId: dto.categoryId as CategoryId,
    categoryName,
    priceLabel: formatPriceLabel(dto.price),
    imageSrc: dto.imageSrc,
    imageAlt: dto.imageAlt,
    shortDescription: dto.shortDescription,
  };
}
