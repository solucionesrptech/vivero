"use client";

import Image from "next/image";
import { useState } from "react";
import type { CatalogProduct } from "@/lib/types/catalog-product";
import type { CartLineDraft } from "@/lib/types/cart-selection";
import { AvailabilityBadge } from "@/components/catalog/AvailabilityBadge";
import { ProductSelectionModal } from "@/components/catalog/ProductSelectionModal";

type CatalogProductCardProps = {
  product: CatalogProduct;
  /** Futuro carrito: recibir desde el layout o provider. */
  onAddToCart?: (draft: CartLineDraft) => void;
};

export function CatalogProductCard({ product, onAddToCart }: CatalogProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-sm transition-shadow hover:shadow-md">
        <div className="relative h-64 w-full overflow-hidden bg-background">
          <Image
            src={product.imageSrc}
            alt={product.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 min-h-[3.5rem] font-display text-lg leading-snug text-foreground">
              {product.name}
            </h3>
            <AvailabilityBadge isAvailable={product.isAvailable} />
          </div>
          <p className="line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-muted">
            {product.shortDescription}
          </p>
          <div className="mt-auto flex flex-col gap-2 pt-2">
            <p className="text-sm font-medium text-primary">{product.priceLabel}</p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="w-full rounded-full border border-border-subtle bg-background py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-background/80"
            >
              Agregar
            </button>
          </div>
        </div>
      </article>

      <ProductSelectionModal
        product={product}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddToCart={onAddToCart}
      />
    </>
  );
}
