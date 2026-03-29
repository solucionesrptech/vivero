"use client";

import { ADMIN_TOKEN_STORAGE_KEY } from "@/lib/admin/token-storage";

export function AdminLogoutButton() {
  return (
    <button
      type="button"
      className="font-medium text-primary underline-offset-2 hover:underline"
      onClick={() => {
        localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
        window.location.href = "/login";
      }}
    >
      Cerrar sesión
    </button>
  );
}
