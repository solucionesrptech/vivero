import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { CartDomainError, type CartDomainErrorKind } from './cart.domain-error';

/** Mapeo exhaustivo CartDomainErrorKind → HttpStatus (fallo de compilación si falta un kind). */
const CART_DOMAIN_HTTP_STATUS: Record<CartDomainErrorKind, number> = {
  INVALID_QUANTITY: HttpStatus.BAD_REQUEST,
  STOCK_INSUFFICIENT: HttpStatus.BAD_REQUEST,
  CART_EMPTY: HttpStatus.BAD_REQUEST,
  PRODUCT_NOT_FOUND: HttpStatus.NOT_FOUND,
  CART_NOT_FOUND: HttpStatus.NOT_FOUND,
  CART_ITEM_NOT_FOUND: HttpStatus.NOT_FOUND,
};

function httpStatusForCartDomain(kind: CartDomainErrorKind): number {
  return CART_DOMAIN_HTTP_STATUS[kind];
}

/**
 * Traduce errores de dominio del carrito a respuestas HTTP.
 * No contiene reglas de negocio: solo mapeo kind → código y mensaje ya definido en dominio.
 */
@Catch(CartDomainError)
export class CartDomainExceptionFilter implements ExceptionFilter {
  catch(exception: CartDomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = httpStatusForCartDomain(exception.kind);
    res.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
