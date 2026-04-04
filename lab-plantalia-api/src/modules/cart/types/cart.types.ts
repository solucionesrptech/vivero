import type { DeliveryType } from '@prisma/client';

/**
 * Filas planas devueltas por el DAL (objetos simples, sin instancias Prisma).
 * `DeliveryType` se importa solo como tipo para alinear con el schema.
 */

export type ProductRow = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

export type CartItemRow = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  lineSubtotal: number;
};

export type CartItemWithProductRow = CartItemRow & { product: ProductRow };

export type CartWithItemsRow = {
  id: string;
  total: number;
  items: CartItemWithProductRow[];
};

export type CheckoutOrderInput = {
  deliveryType: DeliveryType;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string | null;
};

/** Datos del pedido recién creado para la respuesta de checkout y consulta pública del cliente. */
export type CheckoutOrderSnapshot = {
  id: string;
  publicCode: string;
  status: string;
  total: number;
  deliveryType: DeliveryType;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string | null;
  lines: { productName: string; quantity: number; lineSubtotal: number }[];
};
