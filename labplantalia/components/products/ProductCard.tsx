"use client";

import Image from "next/image";
import { useState } from "react";
import { DeliveryEstimateNotice } from "@/components/delivery/DeliveryEstimateNotice";
import type { FeaturedProduct } from "@/lib/data/home-mock";

type ProductCardProps = {
  product: FeaturedProduct;
  /** Sin lógica de negocio: el padre conecta API / contexto. */
  onAddToCart?: (productId: string) => void | Promise<void>;
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [adding, setAdding] = useState(false);

  async function handleAddToCart() {
    if (!onAddToCart || adding) return;
    setAdding(true);
    try {
      await onAddToCart(product.id);
    } catch {
      /* Mensaje en CartProvider */
    } finally {
      setAdding(false);
    }
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-background">
        <Image
          src={product.imageSrc}
          alt={product.imageAlt}
          fill
          unoptimized={/^https?:\/\//i.test(product.imageSrc)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">
          {product.categoryName}
        </p>
        <h3 className="font-display text-xl text-foreground">{product.name}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted">
          {product.shortDescription}
        </p>
        <p className="mt-auto pt-2 text-sm font-medium text-primary">
          {product.priceLabel}
        </p>
        <DeliveryEstimateNotice variant="short" className="pt-1" />
        {onAddToCart ? (
          <button
            type="button"
            disabled={adding}
            onClick={() => void handleAddToCart()}
            className="mt-2 w-full rounded-full border border-border-subtle bg-background py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-background/80 disabled:opacity-50"
          >
            {adding ? "Agregando…" : "Agregar al carrito"}
          </button>
        ) : null}
      </div>
    </article>
  );
}
