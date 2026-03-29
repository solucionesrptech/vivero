/** Fallo previsible dentro de la transacción de checkout (mapeado a dominio en BLL). */
export type CartCheckoutDalErrorCode =
  | 'CART_NOT_FOUND'
  | 'CART_EMPTY'
  | 'STOCK_INSUFFICIENT';

export class CartCheckoutDalError extends Error {
  constructor(
    public readonly code: CartCheckoutDalErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'CartCheckoutDalError';
  }
}
