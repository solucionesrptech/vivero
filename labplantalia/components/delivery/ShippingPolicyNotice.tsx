import { SHIPPING_POLICY_DELIVERY_PARAGRAPH } from "@/lib/constants/shipping-policy";

type ShippingPolicyNoticeProps = {
  className?: string;
};

/**
 * Aviso de transportista, pago del flete y total sin envío; solo para flujos con delivery.
 */
export function ShippingPolicyNotice({ className = "" }: ShippingPolicyNoticeProps) {
  const merged = ["text-sm leading-snug text-muted", className].filter(Boolean).join(" ");
  return <p className={merged}>{SHIPPING_POLICY_DELIVERY_PARAGRAPH}</p>;
}
