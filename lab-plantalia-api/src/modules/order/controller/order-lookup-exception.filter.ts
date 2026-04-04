import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { OrderLookupDomainError } from '../bll/order-lookup.bll';

@Catch(OrderLookupDomainError)
export class OrderLookupExceptionFilter implements ExceptionFilter {
  catch(exception: OrderLookupDomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status =
      exception.code === 'NOT_FOUND'
        ? HttpStatus.NOT_FOUND
        : HttpStatus.BAD_REQUEST;
    res.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
