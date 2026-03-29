"use client";

import { ProductCard } from "@/components/products/ProductCard";
import { featuredProducts } from "@/lib/data/home-mock";
import { useCart } from "@/context/cart.context";

export function FeaturedPlants() {
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
            Una muestra de lo que puedes encontrar en el vivero. Pronto podrás
            explorar el catálogo completo.
          </p>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(id) => addItem(id, 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
