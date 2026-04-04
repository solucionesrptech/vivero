"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SHIPPING_POLICY_DELIVERY_PARAGRAPH } from "@/lib/constants/shipping-policy";
import { fetchOrderLookup } from "@/services/order-lookup.service";
import type { OrderLookupResult } from "@/lib/types/order-lookup-api";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  CANCELLED: "Cancelado",
  AWAITING_PREPARATION: "Por preparar",
  READY_FOR_DELIVERY: "Listo para entregar",
  READY_FOR_PICKUP: "Listo para retiro",
  PICKED_UP: "Retirado",
  DELIVERED: "Entregado",
};

export default function ConsultaPedidoPage() {
  const [publicCode, setPublicCode] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<OrderLookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof sessionStorage === "undefined") return;
    const saved = sessionStorage.getItem("plantalia-last-order-code");
    if (saved) setPublicCode(saved);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const r = await fetchOrderLookup(publicCode, phone);
      setResult(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al consultar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="text-sm text-primary underline-offset-4 hover:underline"
      >
        Volver al inicio
      </Link>
      <h1 className="mt-6 font-display text-2xl text-foreground">Consultar pedido</h1>
      <p className="mt-2 text-sm text-muted">
        Ingresa el código del pedido y el mismo teléfono que usaste al comprar.
      </p>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="mt-8 space-y-4 rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm"
      >
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
            Código de pedido
          </label>
          <input
            type="text"
            value={publicCode}
            onChange={(e) => setPublicCode(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
            autoComplete="off"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
            Teléfono
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
            autoComplete="tel"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-surface transition-opacity hover:opacity-90 disabled:opacity-45"
        >
          {loading ? "Buscando…" : "Consultar"}
        </button>
      </form>

      {error ? (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-border-subtle bg-background px-4 py-3 text-sm text-red-700 dark:text-red-300"
        >
          {error}
        </p>
      ) : null}

      {result ? (
        <section className="mt-8 rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm">
          <h2 className="font-display text-lg text-foreground">{result.publicCode}</h2>
          <p className="mt-2 text-sm text-muted">
            Estado: {STATUS_LABEL[result.status] ?? result.status}
          </p>
          <p className="text-sm text-muted">
            {result.deliveryType === "DELIVERY" ? "Delivery" : "Retiro en tienda"}
            {result.deliveryAddress ? ` · ${result.deliveryAddress}` : ""}
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            Total productos: ${result.total.toLocaleString("es-CL")} CLP
          </p>
          {result.deliveryType === "DELIVERY" ? (
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {SHIPPING_POLICY_DELIVERY_PARAGRAPH}
            </p>
          ) : null}
          <ul className="mt-4 space-y-1 text-sm text-foreground">
            {result.items.map((i, idx) => (
              <li key={`${i.productName}-${idx}`}>
                {i.productName} ×{i.quantity}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
