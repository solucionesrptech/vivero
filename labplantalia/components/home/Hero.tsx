import Image from "next/image";
import Link from "next/link";
import { heroBackgroundSrc } from "@/lib/data/home-mock";

export function Hero() {
  return (
    <section
      className="relative min-h-[78vh] overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <Image
        src={heroBackgroundSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-primary/55 via-primary/40 to-background/95"
        aria-hidden
      />
      <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-surface/90">
          Vivero en Valparaíso
        </p>
        <h1
          id="hero-heading"
          className="font-display text-4xl leading-[1.1] text-surface sm:text-5xl lg:text-6xl"
        >
          Naturaleza que crece contigo
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-surface/90 sm:text-xl">
          Plantas seleccionadas, consejos honestos y un espacio pensado para que
          lleves un pedacito de bosque a casa.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="#categorias"
            className="inline-flex items-center justify-center rounded-full bg-surface px-8 py-3.5 text-sm font-semibold text-primary transition-opacity hover:opacity-90"
          >
            Ver categorías
          </Link>
          <Link
            href="#contacto"
            className="inline-flex items-center justify-center rounded-full border-2 border-surface/80 bg-transparent px-8 py-3.5 text-sm font-semibold text-surface transition-colors hover:bg-surface/10"
          >
            Cómo llegar
          </Link>
        </div>
      </div>
    </section>
  );
}
