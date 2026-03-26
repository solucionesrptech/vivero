import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle bg-primary text-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-2xl">Vivero Plantalia</p>
            <p className="mt-2 max-w-sm text-sm text-surface/80">
              Plantas de interior y exterior, seleccionadas con cuidado en
              Valparaíso.
            </p>
          </div>
          <div className="flex flex-col gap-4 text-sm sm:flex-row sm:gap-12">
            <div>
              <p className="font-medium text-surface">Navegación</p>
              <ul className="mt-3 space-y-2 text-surface/80">
                <li>
                  <Link href="#categorias" className="hover:text-surface">
                    Categorías
                  </Link>
                </li>
                <li>
                  <Link href="#destacados" className="hover:text-surface">
                    Destacados
                  </Link>
                </li>
                <li>
                  <Link href="#contacto" className="hover:text-surface">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-10 border-t border-surface/20 pt-8 text-center text-xs text-surface/60">
          © {year} Vivero Plantalia. Laguna Verde, Valparaíso.
        </p>
      </div>
    </footer>
  );
}
