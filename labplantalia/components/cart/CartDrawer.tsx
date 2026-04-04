"use client";

import { useState } from "react";
import { CartList } from "@/components/cart/CartList";
import { PaymentSuccessModal } from "@/components/cart/PaymentSuccessModal";
import { DeliveryEstimateNotice } from "@/components/delivery/DeliveryEstimateNotice";
import { ShippingPolicyNotice } from "@/components/delivery/ShippingPolicyNotice";
import type {
  CheckoutDeliveryType,
  CheckoutOrderApi,
} from "@/lib/types/checkout-api";
import type { CartItemApi } from "@/lib/types/cart-api";

export type CartCheckoutPayload = {
  deliveryType: CheckoutDeliveryType;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
};

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
  onCheckout: (payload: CartCheckoutPayload) => Promise<CheckoutOrderApi>;
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
  const [modalOrder, setModalOrder] = useState<CheckoutOrderApi | null>(null);
  const [deliveryType, setDeliveryType] =
    useState<CheckoutDeliveryType>("PICKUP");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const hasItems = items.length > 0;
  const payDisabled = busyItemId !== null || isSyncing;

  function validate(): string | null {
    if (customerName.trim().length < 2) {
      return "Indica tu nombre.";
    }
    const digits = customerPhone.replace(/\D/g, "");
    if (digits.length < 8) {
      return "Indica un teléfono válido.";
    }
    if (deliveryType === "DELIVERY" && deliveryAddress.trim().length < 5) {
      return "La dirección es obligatoria para envío a domicilio.";
    }
    return null;
  }

  async function handlePayClick() {
    setLocalError(null);
    const v = validate();
    if (v) {
      setLocalError(v);
      return;
    }
    try {
      const order = await onCheckout({
        deliveryType,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress:
          deliveryType === "DELIVERY" ? deliveryAddress.trim() : undefined,
      });
      setModalOrder(order);
      setPayModalOpen(true);
    } catch {
      /* mensaje en CartProvider */
    }
  }

  function handleModalClose() {
    setPayModalOpen(false);
    setModalOrder(null);
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
            {localError ? (
              <p
                role="alert"
                className="mx-4 mt-3 rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm text-red-700 dark:text-red-300"
              >
                {localError}
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
              <footer className="shrink-0 space-y-4 border-t border-border-subtle bg-surface px-4 py-4">
                <fieldset className="space-y-2">
                  <legend className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Entrega
                  </legend>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border-subtle bg-background px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-background">
                      <input
                        type="radio"
                        name="deliveryType"
                        checked={deliveryType === "PICKUP"}
                        onChange={() => setDeliveryType("PICKUP")}
                        className="text-primary"
                      />
                      Retiro en tienda
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border-subtle bg-background px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-background">
                      <input
                        type="radio"
                        name="deliveryType"
                        checked={deliveryType === "DELIVERY"}
                        onChange={() => setDeliveryType("DELIVERY")}
                        className="text-primary"
                      />
                      Delivery
                    </label>
                  </div>
                </fieldset>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                    Nombre
                  </label>
                  <input
                    type="text"
                    autoComplete="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder="+56 9 1234 5678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
                  />
                </div>
                {deliveryType === "DELIVERY" ? (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                      Dirección de envío
                    </label>
                    <textarea
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full resize-y rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
                    />
                  </div>
                ) : null}
                {deliveryType === "DELIVERY" ? (
                  <div className="space-y-2 pt-1">
                    <DeliveryEstimateNotice />
                    <ShippingPolicyNotice />
                  </div>
                ) : null}
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
        order={modalOrder}
        onClose={handleModalClose}
      />
    </>
  );
}
