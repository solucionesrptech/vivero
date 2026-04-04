"use client";

export function AdminLogoutButton() {
  return (
    <button
      type="button"
      className="font-medium text-primary underline-offset-2 hover:underline"
      onClick={() => {
        void fetch("/api/admin/logout", { method: "POST" }).finally(() => {
        window.location.href = "/login";
        });
      }}
    >
      Cerrar sesión
    </button>
  );
}
