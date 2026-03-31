"use client";

import { useState } from "react";
import { CartList } from "@/components/cart/CartList";
import { PaymentSuccessModal } from "@/components/cart/PaymentSuccessModal";
import { DeliveryEstimateNotice } from "@/components/delivery/DeliveryEstimateNotice";
import type { CartItemApi } from "@/lib/types/cart-api";

export type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  items: CartItemApi[];
  total: number;
  busyItemId: string | null;
  /** true durante checkout o mutaciones de línea */
  isSyncing: boolean;
  error: string | null;
  onIncrease: (item: CartItemApi) => void;
  onDecrease: (item: CartItemApi) => void;
  onRemove: (item: CartItemApi) => void;
  onCheckout: () => Promise<void>;
};

export function CartDrawer({
  open,
  onClose,
  items,
  total,
  busyItemId,
  isSyncing,
  error,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
}: CartDrawerProps) {
  const [payModalOpen, setPayModalOpen] = useState(false);

  const hasItems = items.length > 0;
  const payDisabled = busyItemId !== null || isSyncing;

  async function handlePayClick() {
    try {
      await onCheckout();
      setPayModalOpen(true);
    } catch {
      /* mensaje en CartProvider */
    }
  }

  return (
    <>
    {open ? (
    <div className="fixed inset-0 z-[90] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]"
        aria-label="Cerrar carrito"
        onClick={onClose}
      />
      <aside
        className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-border-subtle bg-surface shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <header className="flex items-center justify-between border-b border-border-subtle px-4 py-4">
          <h2
            id="cart-drawer-title"
            className="font-display text-xl text-foreground"
          >
            Carrito
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-background hover:text-primary"
          >
            Cerrar
          </button>
        </header>
        {error ? (
          <p
            role="alert"
            className="mx-4 mt-3 rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm text-primary"
          >
            {error}
          </p>
        ) : null}
        <div className="flex-1 overflow-y-auto">
          <CartList
            items={items}
            total={total}
            busyItemId={busyItemId}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            onRemove={onRemove}
          />
        </div>
        {hasItems ? (
          <footer className="shrink-0 border-t border-border-subtle bg-surface px-4 py-4">
            <DeliveryEstimateNotice className="mb-3" />
            <button
              type="button"
              disabled={payDisabled}
              onClick={() => void handlePayClick()}
              className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-surface transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isSyncing ? "Procesando…" : "Pagar"}
            </button>
          </footer>
        ) : null}
      </aside>
    </div>
    ) : null}
    <PaymentSuccessModal
      open={payModalOpen}
      onClose={() => setPayModalOpen(false)}
    />
    </>
  );
}
