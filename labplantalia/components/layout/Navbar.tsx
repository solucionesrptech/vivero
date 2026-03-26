import Link from "next/link";

const navLinks = [
  { href: "#categorias", label: "Categorías" },
  { href: "#destacados", label: "Destacados" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle/80 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:gap-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-lg tracking-tight text-primary sm:text-xl md:text-2xl"
        >
          Vivero Plantalia
        </Link>

        <nav
          className="hidden items-center gap-8 text-sm font-medium text-muted md:flex"
          aria-label="Principal"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-full border border-border-subtle px-3 py-2 text-sm font-medium text-primary">
              Menú
            </summary>
            <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-border-subtle bg-surface py-2 shadow-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2.5 text-sm text-muted transition-colors hover:bg-background hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </details>

          <Link
            href="#contacto"
            className="rounded-full bg-primary px-3 py-2 text-sm font-medium text-surface transition-opacity hover:opacity-90 sm:px-5"
          >
            Visítanos
          </Link>
        </div>
      </div>
    </header>
  );
}
