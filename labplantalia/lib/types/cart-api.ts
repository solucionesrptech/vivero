/** Respuestas del endpoint de carrito (alineadas con CartResponseDto del API). */

export type CartItemApi = {
  id: string;
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  lineSubtotal: number;
  /** Stock en inventario (mismo valor que usa el API para validar cantidad). */
  stock: number;
};

export type CartApi = {
  id: string;
  items: CartItemApi[];
  total: number;
};
