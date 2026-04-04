"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { adminLogin } from "@/services/admin-auth.service";

function toSafeNextPath(raw: string | null): string {
  if (!raw) return "/admin";
  if (!raw.startsWith("/")) return "/admin";
  if (raw.startsWith("//")) return "/admin";
  if (!(raw === "/admin" || raw.startsWith("/admin/"))) return "/admin";
  return raw;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = toSafeNextPath(searchParams.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await adminLogin(email.trim(), password);
      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <h1 className="font-display text-2xl text-foreground sm:text-3xl">
          Iniciar sesión
        </h1>
        <p className="mt-2 text-sm text-muted">
          Acceso de administración del vivero. Las credenciales se validan en el servidor.
        </p>

        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="mt-8 flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm"
        >
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground">Correo</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-foreground outline-none ring-primary/30 focus:ring-2"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground">Contraseña</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-foreground outline-none ring-primary/30 focus:ring-2"
            />
          </label>
          {error ? (
            <p className="text-sm text-red-700 dark:text-red-300" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-primary py-3 text-sm font-semibold text-surface transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/" className="font-medium text-primary underline-offset-2 hover:underline">
            Volver al inicio
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
            <p className="text-center text-sm text-muted">Cargando…</p>
          </main>
          <Footer />
        </>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
