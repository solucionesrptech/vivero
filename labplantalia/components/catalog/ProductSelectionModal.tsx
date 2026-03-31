"use client";

import { useEffect, useId, useState } from "react";
import type { CatalogProduct } from "@/lib/types/catalog-product";
import type { CartLineDraft } from "@/lib/types/cart-selection";
import { AvailabilityBadge } from "@/components/catalog/AvailabilityBadge";
import { CatalogProductImage } from "@/components/catalog/CatalogProductImage";
import { DeliveryEstimateNotice } from "@/components/delivery/DeliveryEstimateNotice";

type ProductSelectionModalProps = {
  product: CatalogProduct;
  open: boolean;
  onClose: () => void;
  /** Conectar con carrito (API / contexto). Si falla la promesa, el modal permanece abierto. */
  onAddToCart?: (draft: CartLineDraft) => void | Promise<void>;
};

export function ProductSelectionModal({
  product,
  open,
  onClose,
  onAddToCart,
}: ProductSelectionModalProps) {
  const titleId = useId();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const maxQty = !product.isAvailable
    ? 0
    : product.stock === null
      ? 10
      : Math.max(product.stock, 0);

  const canAdd = product.isAvailable && maxQty > 0;

  useEffect(() => {
    if (open) {
      setQty(1);
      setAdding(false);
    }
  }, [open, product.id]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleAddToCart() {
    if (!canAdd || adding) return;
    const draft: CartLineDraft = {
      productId: product.id,
      quantity: qty,
      product,
    };
    if (onAddToCart) {
      setAdding(true);
      try {
        await onAddToCart(draft);
        onClose();
      } catch {
        /* El error queda en CartProvider; no cerrar el modal ni propagar el rechazo */
      } finally {
        setAdding(false);
      }
      return;
    }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-primary/45 backdrop-blur-[3px]"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-2xl sm:max-w-2xl lg:max-w-4xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-sm text-primary shadow-sm transition-colors hover:bg-surface"
          aria-label="Cerrar"
        >
          ×
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative aspect-[4/3] w-full bg-background sm:aspect-[16/10] lg:aspect-auto lg:min-h-[430px]">
            <CatalogProductImage
              src={product.imageSrc}
              alt={product.imageAlt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 672px, 540px"
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col justify-between gap-4 p-5 sm:p-6">
            <div>
              <h2
                id={titleId}
                className="font-display text-2xl leading-tight text-foreground sm:text-3xl"
              >
                {product.name}
              </h2>
              <p className="mt-2 text-lg font-medium text-primary">
                {product.priceLabel}
              </p>
              <DeliveryEstimateNotice className="mt-2" />
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-medium text-muted">Estado</span>
                <AvailabilityBadge isAvailable={product.isAvailable} />
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted">{product.description}</p>

            {canAdd ? (
              <div>
                {product.stock !== null ? (
                  <p className="text-sm text-muted">
                    {product.stock > 0 ? (
                      <>
                        Disponibles:{" "}
                        <span className="font-semibold tabular-nums text-foreground">
                          {product.stock}
                        </span>
                      </>
                    ) : (
                      <span>No disponible</span>
                    )}
                  </p>
                ) : null}
                <p className="mt-3 text-xs font-medium uppercase tracking-wider text-muted">
                  Cantidad
                </p>
                <div className="mt-2 flex items-center justify-center gap-3 rounded-full border border-border-subtle bg-background px-2 py-2">
                  <button
                    type="button"
                    disabled={qty <= 1}
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-primary transition-colors hover:bg-surface disabled:opacity-40"
                    aria-label="Menos"
                  >
                    −
                  </button>
                  <span className="min-w-[2.5ch] text-center text-base font-semibold tabular-nums text-foreground">
                    {qty}
                  </span>
                  <button
                    type="button"
                    disabled={qty >= maxQty}
                    onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-primary transition-colors hover:bg-surface disabled:opacity-40"
                    aria-label="Más"
                  >
                    +
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-muted">
                Este producto no está disponible por ahora. Puedes revisar otras
                opciones en el catálogo o consultarnos en el vivero.
              </p>
            )}

            <div className="mt-2 flex flex-col gap-3 sm:flex-row-reverse sm:gap-3">
              <button
                type="button"
                disabled={!canAdd || adding}
                onClick={() => void handleAddToCart()}
                className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-surface transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45 sm:flex-1"
              >
                {adding ? "Agregando…" : "Agregar al carrito"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-full border border-border-subtle bg-transparent py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-background sm:flex-1"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
