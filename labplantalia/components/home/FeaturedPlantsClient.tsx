"use client";

import { ProductCard } from "@/components/products/ProductCard";
import type { FeaturedProduct } from "@/lib/data/home-mock";
import { useCart } from "@/context/cart.context";

type Props = {
  products: FeaturedProduct[];
};

export function FeaturedPlantsClient({ products }: Props) {
  const { addItem } = useCart();

  return (
    <section
      id="destacados"
      className="scroll-mt-20 bg-surface py-20 sm:py-24"
      aria-labelledby="destacados-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="destacados-heading"
            className="font-display text-3xl text-foreground sm:text-4xl"
          >
            Plantas destacadas
          </h2>
          <p className="mt-4 text-muted">
            Selección reciente del vivero. Explora cada categoría para ver el catálogo completo.
          </p>
        </div>
        {products.length === 0 ? (
          <p className="mx-auto mt-14 max-w-lg text-center text-sm text-muted">
            No hay productos destacados por ahora. Cuando el vivero publique novedades, aparecerán
            aquí automáticamente.
          </p>
        ) : (
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(id) => addItem(id, 1)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
