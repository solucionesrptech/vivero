"use client";

import { useEffect, useId } from "react";
import {
  SHIPPING_FREIGHT_NOTE,
  SHIPPING_CARRIER_NAME,
  SHIPPING_CHECKOUT_TOTAL_NOTE,
} from "@/lib/constants/shipping-policy";
import type { CheckoutOrderApi } from "@/lib/types/checkout-api";

type PaymentSuccessModalProps = {
  open: boolean;
  order: CheckoutOrderApi | null;
  onClose: () => void;
};

export function PaymentSuccessModal({
  open,
  order,
  onClose,
}: PaymentSuccessModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !order) return null;

  const tipo =
    order.deliveryType === "DELIVERY" ? "Delivery" : "Retiro en tienda";

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
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
        className="relative z-10 w-full max-w-md rounded-2xl border border-border-subtle bg-surface p-6 shadow-2xl sm:p-8"
      >
        <h2
          id={titleId}
          className="font-display text-2xl text-foreground sm:text-3xl"
        >
          Pago verificado
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          Gracias por su compra. Tu pedido quedó registrado con el código{" "}
          <span className="font-semibold text-foreground">
            {order.publicCode}
          </span>
          . Conserva esa referencia para cualquier consulta.
        </p>
        {order.deliveryType === "DELIVERY" ? (
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            Despacho por {SHIPPING_CARRIER_NAME}. {SHIPPING_FREIGHT_NOTE}{" "}
            {SHIPPING_CHECKOUT_TOTAL_NOTE}
          </p>
        ) : null}
        <dl className="mt-4 space-y-2 rounded-xl border border-border-subtle bg-background px-4 py-3 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-muted">Pedido</dt>
            <dd className="font-semibold text-foreground">{order.publicCode}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted">Entrega</dt>
            <dd className="text-foreground">{tipo}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted">Total productos</dt>
            <dd className="font-semibold text-foreground">
              ${order.total.toLocaleString("es-CL")} CLP
            </dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-surface transition-opacity hover:opacity-90"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
