"use client";

import { formatClp } from "@/lib/format/clp";
import type { TopProductSold } from "@/lib/types/analytics-api";

type Props = {
  rows: TopProductSold[];
  loading: boolean;
  error: string | null;
};

export function TopProductsAnalytics({ rows, loading, error }: Props) {
  const maxQty = rows.length
    ? Math.max(...rows.map((r) => r.totalQuantitySold), 1)
    : 1;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl text-foreground">Productos más vendidos</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Basado en pedidos que ya cuentan como venta (checkout y flujo operativo; excluye
          cancelados). No incluye carritos abiertos.
        </p>
      </div>

      {error ? (
        <p className="rounded-xl border border-border-subtle bg-background px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      ) : null}

      <section
        className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm sm:p-6"
        aria-busy={loading}
        aria-label="Gráfico de unidades vendidas por producto"
      >
        {loading ? (
          <p className="py-12 text-center text-sm text-muted">Cargando analytics…</p>
        ) : rows.length === 0 && !error ? (
          <p className="py-12 text-center text-sm text-muted">
            Aún no hay ventas confirmadas registradas. Cuando los clientes completen un checkout,
            verás aquí el ranking.
          </p>
        ) : (
          <ul className="space-y-4">
            {rows.map((r) => {
              const pct = Math.round((r.totalQuantitySold / maxQty) * 100);
              return (
                <li key={r.productId}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 gap-y-1">
                    <span className="min-w-0 flex-1 font-medium text-foreground">
                      {r.productName}
                    </span>
                    <span className="shrink-0 tabular-nums text-sm text-muted">
                      {r.totalQuantitySold}{" "}
                      {r.totalQuantitySold === 1 ? "unidad" : "unidades"}
                    </span>
                  </div>
                  <svg
                    className="mt-2 block h-3 w-full"
                    viewBox="0 0 100 8"
                    preserveAspectRatio="none"
                    role="presentation"
                    aria-hidden
                  >
                    <rect width={100} height={8} rx={4} className="fill-background" />
                    <rect width={pct} height={8} rx={4} className="fill-primary/80" />
                  </svg>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {!loading && rows.length > 0 ? (
        <section className="overflow-x-auto rounded-2xl border border-border-subtle bg-surface shadow-sm">
          <h3 className="border-b border-border-subtle bg-background/60 px-4 py-3 font-display text-lg text-foreground">
            Resumen
          </h3>
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-background/40">
                <th className="px-4 py-3 font-semibold text-foreground">Producto</th>
                <th className="px-4 py-3 font-semibold text-foreground">Unidades</th>
                <th className="px-4 py-3 font-semibold text-foreground">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.productId} className="border-b border-border-subtle/80 last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{r.productName}</td>
                  <td className="px-4 py-3 tabular-nums text-muted">{r.totalQuantitySold}</td>
                  <td className="px-4 py-3 tabular-nums text-foreground">
                    {formatClp(r.totalRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}
    </div>
  );
}
