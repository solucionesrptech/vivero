type AvailabilityBadgeProps = {
  isAvailable: boolean;
  className?: string;
};

/**
 * Indicador de disponibilidad. Con API: derivar de `isAvailable` y/o `stock`.
 */
export function AvailabilityBadge({
  isAvailable,
  className = "",
}: AvailabilityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ${isAvailable ? "bg-accent/15 text-primary" : "bg-background text-muted"} ${className}`}
    >
      {isAvailable ? "Disponible" : "Agotado"}
    </span>
  );
}
