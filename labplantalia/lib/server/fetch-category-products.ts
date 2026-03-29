import { getPlantaliaApiBaseUrl } from "@/lib/config/plantalia-api";
import { mapProductApiToCatalogProduct } from "@/lib/mappers/catalog-product-from-api";
import type { CatalogProduct } from "@/lib/types/catalog-product";
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
 * Obtiene el catálogo de una categoría desde el API Nest.
 * Sin caché de Next: el stock debe coincidir con la BD tras checkout o ajustes en admin.
 */
export async function fetchCategoryCatalogProducts(
  categorySlug: string,
): Promise<CatalogProduct[]> {
  const base = getPlantaliaApiBaseUrl();
  const url = `${base}/products?categorySlug=${encodeURIComponent(categorySlug)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(
        "No se pudo conectar con el catálogo. Comprueba que el API esté en marcha y NEXT_PUBLIC_PLANTALIA_API_URL.",
      );
    }
    throw e;
  }

  if (!res.ok) {
    throw new Error(`El catálogo respondió con error (${res.status}).`);
  }

  const data: unknown = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Respuesta de catálogo inválida.");
  }

  const products: CatalogProduct[] = [];
  for (const item of data) {
    if (!isProductApiDto(item)) continue;
    const mapped = mapProductApiToCatalogProduct(item);
    if (mapped) products.push(mapped);
  }
  return products;
}
