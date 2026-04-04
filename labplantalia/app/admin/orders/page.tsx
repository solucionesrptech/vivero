"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ADMIN_TOKEN_STORAGE_KEY } from "@/lib/admin/token-storage";
import type { AdminOrderDetail, AdminOrderListRow } from "@/lib/types/admin-orders-api";
import {
  fetchAdminOrderDetail,
  fetchAdminOrders,
  patchAdminOrderStatus,
} from "@/services/admin-orders.service";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado (legado)",
  CANCELLED: "Cancelado",
  AWAITING_PREPARATION: "Por preparar",
  READY_FOR_DELIVERY: "Listo para entregar",
  READY_FOR_PICKUP: "Listo para retiro",
  PICKED_UP: "Retirado por cliente",
  DELIVERED: "Entregado",
};

function labelStatus(s: string): string {
  return STATUS_LABEL[s] ?? s;
}

const STATUS_PREPARING = new Set(["CONFIRMED", "AWAITING_PREPARATION"]);
const STATUS_WAITING = new Set(["READY_FOR_PICKUP", "READY_FOR_DELIVERY"]);
const STATUS_DONE = new Set(["PICKED_UP", "DELIVERED"]);

function partitionOrders(rows: AdminOrderListRow[]) {
  const preparing: AdminOrderListRow[] = [];
  const waiting: AdminOrderListRow[] = [];
  const done: AdminOrderListRow[] = [];
  const other: AdminOrderListRow[] = [];
  for (const r of rows) {
    if (STATUS_PREPARING.has(r.status)) preparing.push(r);
    else if (STATUS_WAITING.has(r.status)) waiting.push(r);
    else if (STATUS_DONE.has(r.status)) done.push(r);
    else other.push(r);
  }
  return { preparing, waiting, done, other };
}

function deliveryShortLabel(deliveryType: string): string {
  return deliveryType === "DELIVERY" ? "Delivery" : "Retiro";
}

export default function AdminOrdersPage() {
  const [rows, setRows] = useState<AdminOrderListRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
    if (!token) return;
    setLoadError(null);
    setLoadingList(true);
    try {
      const list = await fetchAdminOrders(token);
      setRows(list);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "No se pudo cargar los pedidos.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const { preparing, waiting, done, other } = useMemo(
    () => partitionOrders(rows),
    [rows],
  );

  async function onPreparado(row: AdminOrderListRow) {
    const token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
    if (!token) return;
    setBusyId(row.id);
    setLoadError(null);
    try {
      let d: AdminOrderDetail = await fetchAdminOrderDetail(token, row.id);
      if (d.status === "CONFIRMED") {
        d = await patchAdminOrderStatus(token, row.id, "AWAITING_PREPARATION");
      }
      if (d.status === "AWAITING_PREPARATION") {
        const next =
          d.deliveryType === "DELIVERY" ? "READY_FOR_DELIVERY" : "READY_FOR_PICKUP";
        d = await patchAdminOrderStatus(token, row.id, next);
      }
      await load();
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "No se pudo marcar como preparado.");
    } finally {
      setBusyId(null);
    }
  }

  async function onEntrega(row: AdminOrderListRow) {
    const token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
    if (!token) return;
    setBusyId(row.id);
    setLoadError(null);
    try {
      const d = await fetchAdminOrderDetail(token, row.id);
      const next = d.deliveryType === "DELIVERY" ? "DELIVERED" : "PICKED_UP";
      await patchAdminOrderStatus(token, row.id, next);
      await load();
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "No se pudo registrar la entrega.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted" aria-label="Secciones de administración">
        <Link href="/admin" className="text-primary underline-offset-4 hover:underline">
          Stock
        </Link>
        <span className="mx-2 text-border-subtle" aria-hidden>
          /
        </span>
        <Link
          href="/admin/analytics"
          className="text-primary underline-offset-4 hover:underline"
        >
          Analytics
        </Link>
        <span className="mx-2 text-border-subtle" aria-hidden>
          /
        </span>
        <span className="font-medium text-foreground">Pedidos</span>
      </nav>

      <h1 className="font-display text-2xl text-foreground">Pedidos</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        Tres etapas: preparación (al llegar el pedido), espera de retiro o entrega al cliente,
        y cierre. «Preparado» deja el pedido listo para retiro o despacho; el cliente puede ver el
        estado en la página de consulta con su código y teléfono.
      </p>

      {loadError ? (
        <p className="mt-6 rounded-xl border border-border-subtle bg-background px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {loadError}
        </p>
      ) : null}

      {loadingList ? (
        <p className="mt-8 text-center text-sm text-muted">Cargando…</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted">No hay pedidos.</p>
      ) : (
        <>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <OrderColumn
              title="En preparación"
              hint="Pedidos recién ingresados o por armar."
            >
              {preparing.length === 0 ? (
                <EmptyColumn />
              ) : (
                preparing.map((r) => (
                  <OrderCard
                    key={r.id}
                    row={r}
                    busy={busyId === r.id}
                    actions={
                      <button
                        type="button"
                        disabled={busyId !== null}
                        onClick={() => void onPreparado(r)}
                        className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-surface transition-opacity hover:opacity-90 disabled:opacity-45"
                      >
                        Preparado
                      </button>
                    }
                  />
                ))
              )}
            </OrderColumn>

            <OrderColumn
              title="Esperando cliente"
              hint="Listo para retiro o para entregar (delivery)."
            >
              {waiting.length === 0 ? (
                <EmptyColumn />
              ) : (
                waiting.map((r) => (
                  <OrderCard
                    key={r.id}
                    row={r}
                    busy={busyId === r.id}
                    actions={
                      <button
                        type="button"
                        disabled={busyId !== null}
                        onClick={() => void onEntrega(r)}
                        className="w-full rounded-full border border-border-subtle bg-background px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-background/80 disabled:opacity-45"
                      >
                        Entrega
                      </button>
                    }
                  />
                ))
              )}
            </OrderColumn>

            <OrderColumn title="Pedido entregado" hint="Cerrados en tienda o entregados.">
              {done.length === 0 ? (
                <EmptyColumn />
              ) : (
                done.map((r) => (
                  <OrderCard
                    key={r.id}
                    row={r}
                    busy={busyId === r.id}
                    actions={
                      <p className="text-center text-xs text-muted">
                        {labelStatus(r.status)}
                      </p>
                    }
                  />
                ))
              )}
            </OrderColumn>
          </div>

          {other.length > 0 ? (
            <section className="mt-10 rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm">
              <h2 className="font-display text-lg text-foreground">Otros estados</h2>
              <p className="mt-1 text-sm text-muted">
                Pedidos pendientes, cancelados u otros; no entran en el tablero principal.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-foreground">
                {other.map((r) => (
                  <li
                    key={r.id}
                    className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border-subtle/80 py-2 last:border-0"
                  >
                    <span className="font-medium">{r.publicCode}</span>
                    <span className="text-muted">
                      {r.customerName} · {labelStatus(r.status)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}

function OrderColumn({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <section className="flex max-h-[min(70vh,720px)] flex-col rounded-2xl border border-border-subtle bg-surface shadow-sm">
      <header className="shrink-0 border-b border-border-subtle bg-background/60 px-4 py-3">
        <h2 className="font-display text-lg text-foreground">{title}</h2>
        <p className="mt-0.5 text-xs text-muted">{hint}</p>
      </header>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">{children}</div>
    </section>
  );
}

function EmptyColumn() {
  return (
    <p className="py-8 text-center text-sm text-muted">Nada en esta columna por ahora.</p>
  );
}

function OrderCard({
  row,
  busy,
  actions,
}: {
  row: AdminOrderListRow;
  busy: boolean;
  actions: ReactNode;
}) {
  return (
    <article
      className="rounded-xl border border-border-subtle bg-background/80 p-4 shadow-sm"
      aria-busy={busy}
    >
      <p className="font-mono text-sm font-semibold text-foreground">{row.publicCode}</p>
      <p className="mt-1 text-sm text-muted">{row.customerName}</p>
      <p className="mt-0.5 text-xs text-muted">
        {deliveryShortLabel(row.deliveryType)} · ${row.total.toLocaleString("es-CL")}
      </p>
      <p className="mt-1 text-xs text-muted">{labelStatus(row.status)}</p>
      <div className="mt-3 border-t border-border-subtle/80 pt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Productos
        </p>
        {(row.items ?? []).length > 0 ? (
          <ul className="mt-1.5 space-y-1 text-sm text-foreground">
            {(row.items ?? []).map((i, idx) => (
              <li key={`${row.id}-${i.productName}-${idx}`}>
                <span className="text-foreground">{i.productName}</span>
                <span className="text-muted"> ×{i.quantity}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1.5 text-sm text-muted">Sin líneas registradas.</p>
        )}
      </div>
      <div className="mt-3">{actions}</div>
    </article>
  );
}
