import Image from "next/image";

import { isSafeForNextImage } from "@/lib/isSafeForNextImage";

type CatalogProductImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export function CatalogProductImage({
  src,
  alt,
  fill,
  sizes,
  className = "",
  priority,
}: CatalogProductImageProps) {
  const trimmed = (src ?? "").trim();
  const label = alt.trim() || "Sin imagen de producto";
  const useNext = trimmed.length > 0 && isSafeForNextImage(trimmed);

  if (!useNext) {
    const position = fill ? "absolute inset-0" : "";
    return (
      <div
        className={`flex items-center justify-center bg-background text-muted ${position} ${className}`}
        role="img"
        aria-label={label}
      >
        <span className="px-4 text-center text-sm">Sin foto</span>
      </div>
    );
  }

  return (
    <Image
      src={trimmed}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
