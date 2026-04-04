"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdminAuthGuardProps = {
  children: React.ReactNode;
};

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const res = await fetch("/api/admin/session", {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("UNAUTHORIZED");
        }
        if (!cancelled) {
          setReady(true);
        }
      } catch {
        if (cancelled) return;
        const nextPath = `${window.location.pathname}${window.location.search}`;
        router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
      }
    }

    void checkSession();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready) {
    return (
      <p className="px-4 py-12 text-center text-sm text-muted">Comprobando sesión…</p>
    );
  }

  return <>{children}</>;
}
