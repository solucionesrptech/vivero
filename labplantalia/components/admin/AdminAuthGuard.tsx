"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_TOKEN_STORAGE_KEY } from "@/lib/admin/token-storage";

type AdminAuthGuardProps = {
  children: React.ReactNode;
};

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
    if (!token) {
      router.replace("/login?next=/admin");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <p className="px-4 py-12 text-center text-sm text-muted">Comprobando sesión…</p>
    );
  }

  return <>{children}</>;
}
