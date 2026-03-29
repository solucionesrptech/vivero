"use client";

import { useCart } from "@/context/cart.context";

export function NavbarCart() {
  const { itemCount, openDrawer, isHydrated } = useCart();

  return (
    <button
      type="button"
      onClick={openDrawer}
      className="rounded-full border border-border-subtle px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-background"
      aria-label={`Abrir carrito, ${itemCount} artículos`}
    >
      <span aria-hidden>🛒</span>
      {isHydrated ? (
        <span className="ml-1.5 tabular-nums">({itemCount})</span>
      ) : (
        <span className="ml-1.5 tabular-nums">(…)</span>
      )}
    </button>
  );
}
