import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/data/home-mock";

export function Categories() {
  return (
    <section
      id="categorias"
      className="scroll-mt-20 bg-background py-20 sm:py-24"
      aria-labelledby="categorias-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="categorias-heading"
            className="font-display text-3xl text-foreground sm:text-4xl"
          >
            Explora por categoría
          </h2>
          <p className="mt-4 text-muted">
            Plantas y detalles para encontrar lo que mejor encaja en tu espacio y
            tu ritmo de vida.
          </p>
        </div>
        <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href="#destacados"
                className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border-subtle shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <Image
                  src={cat.imageSrc}
                  alt={cat.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/35 to-transparent"
                  aria-hidden
                />
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
                  <h3 className="font-display text-xl leading-tight text-surface sm:text-2xl">
                    {cat.name}
                  </h3>
                  <span className="mt-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-surface/80">
                    Explorar
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
