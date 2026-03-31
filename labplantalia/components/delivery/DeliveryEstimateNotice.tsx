import {
  DELIVERY_ESTIMATE_FULL,
  DELIVERY_ESTIMATE_SHORT,
} from "@/lib/constants/delivery-estimate";

type DeliveryEstimateNoticeProps = {
  variant?: "full" | "short";
  className?: string;
};

/**
 * Aviso de tiempo de entrega; solo presentación (textos desde `delivery-estimate`).
 */
export function DeliveryEstimateNotice({
  variant = "full",
  className = "",
}: DeliveryEstimateNoticeProps) {
  const text = variant === "short" ? DELIVERY_ESTIMATE_SHORT : DELIVERY_ESTIMATE_FULL;
  const base =
    variant === "short"
      ? "text-xs leading-snug text-muted"
      : "text-sm leading-snug text-muted";
  const merged = [base, className].filter(Boolean).join(" ");
  return <p className={merged}>{text}</p>;
}
