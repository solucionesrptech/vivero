/** Fallo previsible dentro de la transacción de checkout (mapeado a dominio en BLL). */
export type CartCheckoutDalErrorCode =
  | 'CART_NOT_FOUND'
  | 'CART_EMPTY'
  | 'STOCK_INSUFFICIENT'
  | 'PUBLIC_CODE_GENERATION_FAILED';

export class CartCheckoutDalError extends Error {
  constructor(
    public readonly code: CartCheckoutDalErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'CartCheckoutDalError';
  }
}
