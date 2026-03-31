import { fetchFeaturedProducts } from "@/lib/server/fetch-featured-products";
import { FeaturedPlantsClient } from "./FeaturedPlantsClient";

export async function FeaturedPlants() {
  let products: Awaited<ReturnType<typeof fetchFeaturedProducts>> = [];
  try {
    products = await fetchFeaturedProducts(6);
  } catch {
    products = [];
  }
  return <FeaturedPlantsClient products={products} />;
}
