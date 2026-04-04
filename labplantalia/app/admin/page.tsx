"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { AdminProductRow } from "@/lib/types/admin-api";
import {
  fetchAdminProducts,
  patchAdminProductStock,
} from "@/services/admin-products.service";

export default function AdminDashboardPage() {
  const [rows, setRows] = useState<AdminProductRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    setLoadingList(true);
    try {
      const list = await fetchAdminProducts();
      setRows(list);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "No se pudo cargar el listado.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function adjust(productId: string, delta: number) {
    setBusyId(productId);
    try {
      const updated = await patchAdminProductStock(productId, delta);
      setRows((prev) =>
        prev.map((r) => (r.id === updated.id ? { ...r, stock: updated.stock } : r)),
      );
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error al actualizar stock.";
      setLoadError(message);
      if (message.includes("cambió de identificador")) {
        await load();
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted" aria-label="Secciones de administración">
        <span className="font-medium text-foreground">Stock de productos</span>
        <span className="mx-2 text-border-subtle" aria-hidden>
          /
        </span>
        <Link
          href="/admin/analytics"
          className="text-primary underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          Analytics
        </Link>
        <span className="mx-2 text-border-subtle" aria-hidden>
          /
        </span>
        <Link
          href="/admin/orders"
          className="text-primary underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          Pedidos
        </Link>
      </nav>

      <h1 className="font-display text-2xl text-foreground">Stock de productos</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Ajustes inmediatos en inventario. Los cambios se reflejan en el catálogo y en el
        carrito según el stock actual del servidor.
      </p>

      {loadError ? (
        <p className="mt-6 rounded-xl border border-border-subtle bg-background px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {loadError}
        </p>
      ) : null}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border-subtle bg-surface shadow-sm">
        {loadingList ? (
          <p className="px-4 py-10 text-center text-sm text-muted">Cargando…</p>
        ) : rows.length === 0 && !loadError ? (
          <p className="px-4 py-10 text-center text-sm text-muted">
            No hay productos en la base de datos.
          </p>
        ) : (
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-background/60">
                <th className="px-4 py-3 font-semibold text-foreground">Producto</th>
                <th className="px-4 py-3 font-semibold text-foreground">Categoría</th>
                <th className="px-4 py-3 font-semibold text-foreground">Stock</th>
                <th className="px-4 py-3 font-semibold text-foreground">Ajustar</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const busy = busyId === r.id;
                return (
                  <tr key={r.id} className="border-b border-border-subtle/80 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                    <td className="px-4 py-3 text-muted">{r.categoryId}</td>
                    <td className="px-4 py-3 tabular-nums text-foreground">{r.stock}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void adjust(r.id, -1)}
                          className="rounded-full border border-border-subtle bg-background px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-background/80 disabled:opacity-50"
                        >
                          −1
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void adjust(r.id, 1)}
                          className="rounded-full border border-border-subtle bg-background px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-background/80 disabled:opacity-50"
                        >
                          +1
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
