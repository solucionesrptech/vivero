export function AboutSection() {
  return (
    <section
      id="nosotros"
      className="scroll-mt-20 border-y border-border-subtle bg-background py-20 sm:py-24"
      aria-labelledby="nosotros-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <h2
              id="nosotros-heading"
              className="font-display text-3xl text-foreground sm:text-4xl"
            >
              Sobre nosotros
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              En Plantalia creemos que cuidar plantas es cuidar el ritmo de la
              vida: observar, regar con calma y celebrar cada hoja nueva.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Seleccionamos especies que se adaptan bien a hogares urbanos y te
              acompañamos con recomendaciones claras, sin tecnicismos innecesarios.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8 shadow-sm">
            <ul className="space-y-6 text-muted">
              <li className="flex gap-4">
                <span
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-primary"
                  aria-hidden
                >
                  1
                </span>
                <span>
                  <strong className="text-foreground">Curaduría local</strong>
                  <br />
                  Plantas elegidas para el clima costero y la vida en departamento
                  o casa.
                </span>
              </li>
              <li className="flex gap-4">
                <span
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-primary"
                  aria-hidden
                >
                  2
                </span>
                <span>
                  <strong className="text-foreground">Marca con calma</strong>
                  <br />
                  Un espacio donde sentirte bienvenido, sin prisas ni presión.
                </span>
              </li>
              <li className="flex gap-4">
                <span
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-primary"
                  aria-hidden
                >
                  3
                </span>
                <span>
                  <strong className="text-foreground">Listos para crecer</strong>
                  <br />
                  Preparados para cuando quieras ampliar tu colección o regalar
                  vida verde.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
