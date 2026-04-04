import { Injectable } from '@nestjs/common';
import { OrderDal, type OrderDetailRow } from '../dal/order.dal';

export class OrderLookupDomainError extends Error {
  constructor(
    public readonly code: 'NOT_FOUND' | 'INVALID_INPUT',
    message: string,
  ) {
    super(message);
    this.name = 'OrderLookupDomainError';
  }
}

@Injectable()
export class OrderLookupBll {
  constructor(private readonly dal: OrderDal) {}

  /** Solo dígitos para comparar con el teléfono guardado en checkout. */
  normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  async lookup(publicCode: string, phone: string): Promise<OrderDetailRow> {
    const code = publicCode.trim();
    const normalized = this.normalizePhone(phone);
    if (code.length < 3 || normalized.length < 8) {
      throw new OrderLookupDomainError(
        'INVALID_INPUT',
        'Código de pedido o teléfono inválido.',
      );
    }
    const row = await this.dal.findByPublicCodeAndPhoneNormalized(code, normalized);
    if (!row) {
      throw new OrderLookupDomainError(
        'NOT_FOUND',
        'No encontramos un pedido con ese código y teléfono.',
      );
    }
    return row;
  }
}
