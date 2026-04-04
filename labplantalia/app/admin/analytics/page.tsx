"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { TopProductsAnalytics } from "@/components/admin/TopProductsAnalytics";
import type { TopProductSold } from "@/lib/types/analytics-api";
import { fetchTopProductsSold } from "@/services/admin-analytics.service";

export default function AdminAnalyticsPage() {
  const [rows, setRows] = useState<TopProductSold[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoadError(null);
    setLoading(true);
    try {
      const list = await fetchTopProductsSold();
      setRows(list);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "No se pudieron cargar las ventas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted" aria-label="Secciones de administración">
        <Link
          href="/admin"
          className="text-primary underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          Stock de productos
        </Link>
        <span className="mx-2 text-border-subtle" aria-hidden>
          /
        </span>
        <span className="font-medium text-foreground">Analytics</span>
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

      <h1 className="font-display text-2xl text-foreground">Analytics</h1>

      <div className="mt-8">
        <TopProductsAnalytics rows={rows} loading={loading} error={loadError} />
      </div>
    </main>
  );
}
