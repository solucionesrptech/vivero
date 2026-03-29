import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CategoriaCatalogClient } from "@/components/catalog/CategoriaCatalogClient";
import {
  getCategoryBySlug,
  isValidCategorySlug,
} from "@/lib/data/catalog-products-mock";
import { categories } from "@/lib/data/home-mock";
import { fetchCategoryCatalogProducts } from "@/lib/server/fetch-category-products";
import type { CatalogProduct } from "@/lib/types/catalog-product";

/** Catálogo desde API; evita fallar el build si el API no está levantado. */
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return { title: "Categoría | Plantalia" };
  return {
    title: `${cat.name} | Catálogo — Vivero Plantalia`,
    description: `Explora ${cat.name} en Vivero Plantalia, Valparaíso.`,
  };
}

export default async function CategoriaPage({ params }: PageProps) {
  const { slug } = await params;

  if (!isValidCategorySlug(slug)) {
    notFound();
  }

  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  let products: CatalogProduct[] = [];
  let catalogError: string | null = null;
  try {
    products = await fetchCategoryCatalogProducts(slug);
  } catch (e) {
    catalogError =
      e instanceof Error ? e.message : "No se pudo cargar el catálogo.";
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col bg-background pb-20 pt-8 sm:pt-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav
            className="mb-8 text-sm text-muted"
            aria-label="Migas de pan"
          >
            <Link href="/" className="transition-colors hover:text-primary">
              Inicio
            </Link>
            <span className="mx-2 text-border-subtle" aria-hidden>
              /
            </span>
            <span className="text-foreground">{category.name}</span>
          </nav>

          <header className="mb-10 max-w-2xl">
            <h1 className="font-display text-3xl text-foreground sm:text-4xl">
              {category.name}
            </h1>
            <p className="mt-3 text-muted">
              Precios y disponibilidad según stock del vivero.
            </p>
          </header>

          {catalogError ? (
            <p
              className="rounded-2xl border border-border-subtle bg-background px-4 py-3 text-sm text-muted"
              role="alert"
            >
              {catalogError}
            </p>
          ) : null}

          <CategoriaCatalogClient products={products} />
        </div>
      </main>
      <Footer />
    </>
  );
}
