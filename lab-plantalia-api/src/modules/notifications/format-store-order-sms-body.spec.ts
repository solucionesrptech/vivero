import type { ClosedOrderNotifyPayload } from './closed-order-notify.types';
import { formatStoreOrderSmsBody } from './format-store-order-sms-body';

const SMS_HEADER_PREFIX = 'Gracias por su compra en Vivero Plantalia\n';

function basePayload(
  overrides: Partial<ClosedOrderNotifyPayload> = {},
): ClosedOrderNotifyPayload {
  return {
    publicCode: 'ABC12',
    total: 24000,
    deliveryType: 'PICKUP',
    customerName: 'Ana',
    customerPhone: '+56 9 1111 2222',
    deliveryAddress: null,
    lines: [{ productName: 'Philodendron Brasil', quantity: 2 }],
    ...overrides,
  };
}

describe('formatStoreOrderSmsBody', () => {
  it('incluye retiro y un ítem', () => {
    const s = formatStoreOrderSmsBody(basePayload());
    expect(s.startsWith(SMS_HEADER_PREFIX)).toBe(true);
    expect(s).toContain('Plantalia pedido ABC12');
    expect(s).toContain('Retiro tienda');
    expect(s).not.toContain('Blue Express');
    expect(s).toContain('Philodendron Brasil');
    expect(s).toContain('×2');
    expect(s).not.toContain('Ana');
    expect(s).not.toContain('$24.000');
  });

  it('incluye dirección en delivery', () => {
    const s = formatStoreOrderSmsBody(
      basePayload({
        deliveryType: 'DELIVERY',
        deliveryAddress: 'Calle Falsa 123',
      }),
    );
    expect(s).toContain('Delivery');
    expect(s).toContain('Dir: Calle Falsa 123');
    expect(s).toContain('Blue Express');
    expect(s).toContain('flete al entregar');
  });

  it('omite dirección vacía en delivery', () => {
    const s = formatStoreOrderSmsBody(
      basePayload({
        deliveryType: 'DELIVERY',
        deliveryAddress: '   ',
      }),
    );
    expect(s).not.toContain('Dir:');
    expect(s).toContain('Blue Express');
  });

  it('resume más de dos líneas con +N más', () => {
    const s = formatStoreOrderSmsBody(
      basePayload({
        lines: [
          { productName: 'A', quantity: 1 },
          { productName: 'B', quantity: 1 },
          { productName: 'C', quantity: 1 },
        ],
      }),
    );
    expect(s).toContain('• A');
    expect(s).toContain('• B');
    expect(s).not.toContain('• C');
    expect(s).toContain('+1 más');
  });

  it('trunca si el cuerpo supera el máximo', () => {
    const s = formatStoreOrderSmsBody(
      basePayload({
        deliveryType: 'DELIVERY',
        deliveryAddress: 'y'.repeat(500),
      }),
    );
    expect(s.length).toBeLessThanOrEqual(420 + SMS_HEADER_PREFIX.length);
    expect(s.startsWith(SMS_HEADER_PREFIX)).toBe(true);
    expect(s.endsWith('...')).toBe(true);
  });
});
