import { getPlantaliaApiBaseUrl } from "@/lib/config/plantalia-api";
import { mapProductApiToFeaturedProduct } from "@/lib/mappers/featured-product-from-api";
import type { FeaturedProduct } from "@/lib/data/home-mock";
import type { ProductApiDto } from "@/lib/types/product-api";

function isProductApiDto(value: unknown): value is ProductApiDto {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.slug === "string" &&
    typeof o.categoryId === "string" &&
    typeof o.name === "string" &&
    typeof o.shortDescription === "string" &&
    typeof o.description === "string" &&
    typeof o.price === "number" &&
    typeof o.imageSrc === "string" &&
    typeof o.imageAlt === "string" &&
    typeof o.stock === "number"
  );
}

/**
 * Destacados desde GET /products/featured (solo activos en el API).
 */
export async function fetchFeaturedProducts(limit = 6): Promise<FeaturedProduct[]> {
  const base = getPlantaliaApiBaseUrl();
  const url = `${base}/products/featured?limit=${encodeURIComponent(String(limit))}`;

  let res: Response;
  try {
    res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(
        "No se pudo conectar con el API de destacados. Comprueba NEXT_PUBLIC_PLANTALIA_API_URL.",
      );
    }
    throw e;
  }

  if (!res.ok) {
    throw new Error(`El API de destacados respondió con error (${res.status}).`);
  }

  const data: unknown = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Respuesta de destacados inválida.");
  }

  const out: FeaturedProduct[] = [];
  for (const item of data) {
    if (!isProductApiDto(item)) continue;
    const mapped = mapProductApiToFeaturedProduct(item);
    if (mapped) out.push(mapped);
  }
  return out;
}
