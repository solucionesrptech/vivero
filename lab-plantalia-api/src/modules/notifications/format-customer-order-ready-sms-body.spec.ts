import { OrderStatus } from '@prisma/client';
import type { CustomerOrderReadySmsPayload } from './customer-order-ready-sms.types';
import { formatCustomerOrderReadySmsBody } from './format-customer-order-ready-sms-body';

function basePayload(
  overrides: Partial<CustomerOrderReadySmsPayload> = {},
): CustomerOrderReadySmsPayload {
  return {
    publicCode: 'P-TEST1',
    customerName: 'Roberto',
    customerPhone: '+56912345678',
    total: 12000,
    lines: [
      { productName: 'Monstera', quantity: 1 },
      { productName: 'Suculenta', quantity: 2 },
    ],
    finalStatus: OrderStatus.READY_FOR_PICKUP,
    ...overrides,
  };
}

describe('formatCustomerOrderReadySmsBody', () => {
  it('retiro: encabezado y bloque esperado', () => {
    const s = formatCustomerOrderReadySmsBody(basePayload());
    expect(s).toContain(
      'Su pedido ya está listo para retiro en Vivero Plantalia.',
    );
    expect(s).toContain('Cliente: Roberto');
    expect(s).toContain('Pedido: P-TEST1');
    expect(s).toContain('Total: $12.000 CLP');
    expect(s).toContain('- Monstera x1');
    expect(s).toContain('- Suculenta x2');
  });

  it('delivery: encabezado de entrega', () => {
    const s = formatCustomerOrderReadySmsBody(
      basePayload({ finalStatus: OrderStatus.READY_FOR_DELIVERY }),
    );
    expect(s).toContain(
      'Su pedido ya está listo para entrega en Vivero Plantalia.',
    );
  });
});
