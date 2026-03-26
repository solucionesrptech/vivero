export function ContactSection() {
  const mapsQuery = encodeURIComponent(
    "Subida a la Iglesia 2, Laguna Verde, Valparaíso, Chile",
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <section
      id="contacto"
      className="scroll-mt-20 bg-surface py-20 sm:py-24"
      aria-labelledby="contacto-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="contacto-heading"
            className="font-display text-3xl text-foreground sm:text-4xl"
          >
            Ubicación y contacto
          </h2>
          <p className="mt-4 text-muted">
            Visítanos en Laguna Verde. Si vienes en auto o micro, te recomendamos
            confirmar horario antes de salir.
          </p>
        </div>
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center rounded-2xl border border-border-subtle bg-background p-8 sm:p-10">
            <h3 className="font-display text-xl text-foreground">Dirección</h3>
            <address className="mt-4 not-italic leading-relaxed text-muted">
              Subida a la Iglesia #2
              <br />
              Laguna Verde
              <br />
              Valparaíso, Chile
            </address>
            <h3 className="mt-10 font-display text-xl text-foreground">
              Contacto
            </h3>
            <p className="mt-4 text-muted">
              Pronto publicaremos teléfono y redes para reservas y consultas.
            </p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex w-fit items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-surface transition-opacity hover:opacity-90"
            >
              Abrir en Google Maps
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border-subtle bg-background">
            <div className="aspect-[4/3] w-full lg:aspect-auto lg:min-h-[320px]">
              <iframe
                title="Mapa: Vivero Plantalia, Laguna Verde, Valparaíso"
                className="h-full min-h-[280px] w-full border-0 lg:min-h-[360px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
