import type { CartApi } from "@/lib/types/cart-api";

export type CheckoutDeliveryType = "DELIVERY" | "PICKUP";

export type CheckoutPayload = {
  cartId: string;
  deliveryType: CheckoutDeliveryType;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
};

export type CheckoutOrderLineApi = {
  productName: string;
  quantity: number;
  lineSubtotal: number;
};

export type CheckoutOrderApi = {
  id: string;
  publicCode: string;
  status: string;
  total: number;
  deliveryType: CheckoutDeliveryType;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string | null;
  lines: CheckoutOrderLineApi[];
};

export type CheckoutResponseApi = {
  cart: CartApi;
  order: CheckoutOrderApi;
};
