import { Injectable } from '@nestjs/common';
import { OrderLookupBll, OrderLookupDomainError } from './order-lookup.bll';
import type { OrderLookupResponseDto } from './dto/order-lookup-response.dto';

@Injectable()
export class OrderLookupFacade {
  constructor(private readonly bll: OrderLookupBll) {}

  async lookup(
    publicCode: string,
    phone: string,
  ): Promise<OrderLookupResponseDto> {
    const row = await this.bll.lookup(publicCode, phone);
    if (!row) {
      throw new OrderLookupDomainError(
        'NOT_FOUND',
        'No encontramos un pedido con ese código y teléfono.',
      );
    }
    return {
      id: row.id,
      publicCode: row.publicCode,
      createdAt: row.createdAt.toISOString(),
      status: row.status,
      total: row.total,
      deliveryType: row.deliveryType,
      customerName: row.customerName,
      customerPhone: row.customerPhone,
      deliveryAddress: row.deliveryAddress,
      items: row.items.map((i) => ({
        productName: i.productName,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        lineSubtotal: i.lineSubtotal,
      })),
    };
  }
}
