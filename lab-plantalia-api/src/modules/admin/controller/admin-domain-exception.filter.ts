import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { AdminAuthDomainError } from '../bll/admin-auth.domain-error';
import { AdminJwtConfigError } from './admin-jwt-secret.util';
import { AdminOrderDomainError } from '../bll/admin-order.domain-error';
import { AdminProductDomainError } from '../bll/admin-product.domain-error';

@Catch(
  AdminAuthDomainError,
  AdminJwtConfigError,
  AdminOrderDomainError,
  AdminProductDomainError,
)
export class AdminDomainExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | AdminAuthDomainError
      | AdminJwtConfigError
      | AdminOrderDomainError
      | AdminProductDomainError,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof AdminAuthDomainError) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: exception.message,
      });
      return;
    }

    if (exception instanceof AdminJwtConfigError) {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: exception.message,
      });
      return;
    }

    if (exception instanceof AdminOrderDomainError) {
      const status =
        exception.code === 'ORDER_NOT_FOUND'
          ? HttpStatus.NOT_FOUND
          : HttpStatus.BAD_REQUEST;
      res.status(status).json({
        statusCode: status,
        message: exception.message,
      });
      return;
    }

    const status =
      exception.code === 'PRODUCT_NOT_FOUND'
        ? HttpStatus.NOT_FOUND
        : exception.code === 'DUPLICATE_SLUG'
          ? HttpStatus.CONFLICT
          : HttpStatus.BAD_REQUEST;
    res.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
