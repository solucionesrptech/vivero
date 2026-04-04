"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  adminCategorySelectOptions,
  type PlantaliaCategorySlug,
} from "@/lib/constants/plantalia-categories";
import type { AdminProductCreated } from "@/lib/types/admin-api";
import { postAdminProduct } from "@/services/admin-products.service";

export default function AdminNewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [category, setCategory] = useState<PlantaliaCategorySlug>(
    adminCategorySelectOptions[0]?.slug ?? "philodendros",
  );
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<AdminProductCreated | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    const priceNum = Number.parseInt(price, 10);
    const stockNum = Number.parseInt(stock, 10);
    if (!Number.isFinite(priceNum) || priceNum < 1) {
      setSubmitError("El precio debe ser un entero mayor a 0 (CLP).");
      return;
    }
    if (!Number.isFinite(stockNum) || stockNum < 0) {
      setSubmitError("El stock debe ser un entero mayor o igual a 0.");
      return;
    }
    setSubmitting(true);
    try {
      const row = await postAdminProduct({
        name: name.trim(),
        description: description.trim(),
        price: priceNum,
        stock: stockNum,
        category,
        imageUrl: imageUrl.trim(),
        isActive,
      });
      setCreated(row);
      setName("");
      setDescription("");
      setPrice("");
      setStock("0");
      setImageUrl("");
      setIsActive(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "No se pudo crear el producto.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted" aria-label="Secciones de administración">
        <Link
          href="/admin"
          className="text-primary underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          Stock
        </Link>
        <span className="mx-2 text-border-subtle" aria-hidden>
          /
        </span>
        <span className="font-medium text-foreground">Nuevo producto</span>
      </nav>

      <h1 className="font-display text-2xl text-foreground">Nuevo producto</h1>
      <p className="mt-2 text-sm text-muted">
        Se publica en el catálogo si está activo y con stock según las reglas del sitio.
      </p>

      {created ? (
        <div
          className="mt-6 rounded-2xl border border-border-subtle bg-background px-4 py-4 text-sm text-foreground"
          role="status"
        >
          <p className="font-medium">Producto creado: {created.name}</p>
          <p className="mt-2 text-muted">
            Código interno <span className="font-mono text-foreground">{created.id.slice(0, 8)}…</span> ·
            slug <span className="font-mono text-foreground">{created.slug}</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-surface transition-opacity hover:opacity-90"
            >
              Volver al stock
            </Link>
            <Link
              href={`/categoria/${created.categoryId}`}
              className="rounded-full border border-border-subtle bg-surface px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-background"
            >
              Ver categoría en la tienda
            </Link>
            <button
              type="button"
              onClick={() => {
                setCreated(null);
                router.refresh();
              }}
              className="rounded-full border border-border-subtle px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-primary"
            >
              Crear otro
            </button>
          </div>
        </div>
      ) : null}

      <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 space-y-5">
        {submitError ? (
          <p
            className="rounded-xl border border-border-subtle bg-background px-4 py-3 text-sm text-red-700 dark:text-red-300"
            role="alert"
          >
            {submitError}
          </p>
        ) : null}

        <div className="space-y-2">
          <label htmlFor="np-name" className="block text-xs font-semibold uppercase tracking-wide text-muted">
            Nombre
          </label>
          <input
            id="np-name"
            type="text"
            required
            maxLength={200}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="np-description"
            className="block text-xs font-semibold uppercase tracking-wide text-muted"
          >
            Descripción
          </label>
          <textarea
            id="np-description"
            required
            rows={4}
            maxLength={8000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full resize-y rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="np-price" className="block text-xs font-semibold uppercase tracking-wide text-muted">
              Precio (CLP, entero)
            </label>
            <input
              id="np-price"
              type="number"
              required
              min={1}
              step={1}
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="np-stock" className="block text-xs font-semibold uppercase tracking-wide text-muted">
              Stock
            </label>
            <input
              id="np-stock"
              type="number"
              required
              min={0}
              step={1}
              inputMode="numeric"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="np-category"
            className="block text-xs font-semibold uppercase tracking-wide text-muted"
          >
            Categoría
          </label>
          <select
            id="np-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as PlantaliaCategorySlug)}
            className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
          >
            {adminCategorySelectOptions.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="np-image" className="block text-xs font-semibold uppercase tracking-wide text-muted">
            URL de la imagen
          </label>
          <input
            id="np-image"
            type="url"
            required
            maxLength={2048}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-border-subtle text-primary"
          />
          Producto activo (visible en catálogo si cumple stock)
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-surface transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:px-10"
        >
          {submitting ? "Guardando…" : "Crear producto"}
        </button>
      </form>
    </main>
  );
}
