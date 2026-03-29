"use client";

import { useEffect, useId } from "react";

type PaymentSuccessModalProps = {
  open: boolean;
  onClose: () => void;
};

export function PaymentSuccessModal({ open, onClose }: PaymentSuccessModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-primary/45 backdrop-blur-[3px]"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-2xl border border-border-subtle bg-surface p-6 shadow-2xl sm:p-8"
      >
        <h2
          id={titleId}
          className="font-display text-2xl text-foreground sm:text-3xl"
        >
          Pago verificado
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          Gracias por su compra
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-surface transition-opacity hover:opacity-90"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
