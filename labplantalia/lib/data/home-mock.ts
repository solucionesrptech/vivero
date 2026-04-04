import type { CategoryId } from "@/lib/constants/plantalia-categories";

export type { CategoryId, CategoryCard } from "@/lib/constants/plantalia-categories";
export { categories } from "@/lib/constants/plantalia-categories";

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

export const heroBackgroundSrc = "/img/hero/hero.jpeg";
