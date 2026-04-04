/**
 * Tipos de fallo de dominio del carrito.
 * El mapeo a HTTP (400 vs 404) lo aplica CartDomainExceptionFilter.
 */
export type CartDomainErrorKind =
  | 'PRODUCT_NOT_FOUND'
  | 'CART_NOT_FOUND'
  | 'CART_ITEM_NOT_FOUND'
  | 'INVALID_QUANTITY'
  | 'STOCK_INSUFFICIENT'
  | 'CART_EMPTY'
  | 'INVALID_CHECKOUT'
  | 'CHECKOUT_FAILED';

/** Error lanzado por la BLL; mensajes en español, sin datos internos. */
export class CartDomainError extends Error {
  constructor(
    public readonly kind: CartDomainErrorKind,
    message: string,
  ) {
    super(message);
    this.name = 'CartDomainError';
  }
}
