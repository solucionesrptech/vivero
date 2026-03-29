import Link from "next/link";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface/95 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <Link
              href="/admin"
              className="font-display text-lg text-primary sm:text-xl"
            >
              Administración
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/" className="text-muted transition-colors hover:text-primary">
                Ver sitio
              </Link>
              <AdminLogoutButton />
            </div>
          </div>
        </header>
        {children}
      </div>
    </AdminAuthGuard>
  );
}
