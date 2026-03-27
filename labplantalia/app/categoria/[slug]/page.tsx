import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CatalogProductCard } from "@/components/catalog/CatalogProductCard";
import {
  getCategoryBySlug,
  getProductsByCategorySlug,
  isValidCategorySlug,
} from "@/lib/data/catalog-products-mock";
import { categories } from "@/lib/data/home-mock";

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
  const products = getProductsByCategorySlug(slug);

  if (!category) {
    notFound();
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
              Selección del catálogo. Próximamente sincronizado con disponibilidad
              en tiempo real.
            </p>
          </header>

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {products.map((product) => (
              <li key={product.id} className="h-full">
                <CatalogProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
