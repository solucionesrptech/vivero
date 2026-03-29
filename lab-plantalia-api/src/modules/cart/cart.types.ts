/** Filas planas devueltas por el DAL (sin tipos de Prisma hacia capas superiores). */

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
