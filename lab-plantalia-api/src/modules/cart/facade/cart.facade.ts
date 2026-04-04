import { Injectable } from '@nestjs/common';
import type { ClosedOrderNotifyPayload } from '../../notifications/closed-order-notify.types';
import { StoreSmsNotifierService } from '../../notifications/store-sms-notifier.service';
import { CartBll } from '../bll/cart.bll';
import type { AddCartItemDto } from '../dto/add-cart-item.dto';
import type { CartItemResponseDto } from '../dto/cart-item-response.dto';
import type { CartResponseDto } from '../dto/cart-response.dto';
import type { CheckoutCartDto } from '../dto/checkout-cart.dto';
import type { CheckoutOrderResponseDto } from '../dto/checkout-order-response.dto';
import type { CheckoutResponseDto } from '../dto/checkout-response.dto';
import type { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import type { CartWithItemsRow, CheckoutOrderSnapshot } from '../types/cart.types';

@Injectable()
export class CartFacade {
  constructor(
    private readonly bll: CartBll,
    private readonly storeSmsNotifier: StoreSmsNotifierService,
  ) {}

  private mapCart(row: CartWithItemsRow): CartResponseDto {
    const items: CartItemResponseDto[] = row.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      name: i.product.name,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
      lineSubtotal: i.lineSubtotal,
      stock: i.product.stock,
    }));
    return {
      id: row.id,
      items,
      total: row.total,
    };
  }

  async addItem(dto: AddCartItemDto): Promise<CartResponseDto> {
    const row = await this.bll.addItem(dto);
    return this.mapCart(row);
  }

  async getCart(cartId: string): Promise<CartResponseDto> {
    const row = await this.bll.getCart(cartId);
    return this.mapCart(row);
  }

  async updateItem(
    itemId: string,
    cartId: string,
    dto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    const row = await this.bll.updateItem(itemId, cartId, dto);
    return this.mapCart(row);
  }

  async removeItem(itemId: string, cartId: string): Promise<CartResponseDto> {
    const row = await this.bll.removeItem(itemId, cartId);
    return this.mapCart(row);
  }

  private toClosedOrderNotifyPayload(
    order: CheckoutOrderSnapshot,
  ): ClosedOrderNotifyPayload {
    return {
      publicCode: order.publicCode,
      total: order.total,
      deliveryType:
        order.deliveryType === 'DELIVERY' ? 'DELIVERY' : 'PICKUP',
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      lines: order.lines.map((l) => ({
        productName: l.productName,
        quantity: l.quantity,
      })),
    };
  }

  private mapOrder(row: CheckoutOrderSnapshot): CheckoutOrderResponseDto {
    return {
      id: row.id,
      publicCode: row.publicCode,
      status: row.status,
      total: row.total,
      deliveryType: row.deliveryType,
      customerName: row.customerName,
      customerPhone: row.customerPhone,
      deliveryAddress: row.deliveryAddress,
      lines: row.lines.map((l) => ({
        productName: l.productName,
        quantity: l.quantity,
        lineSubtotal: l.lineSubtotal,
      })),
    };
  }

  async checkout(dto: CheckoutCartDto): Promise<CheckoutResponseDto> {
    const { cart, order } = await this.bll.checkout(dto);

    /*
     * Hook temporal (V1 sin pasarela de pago): notificación SMS a la tienda tras cerrar
     * el pedido en este checkout. Cuando exista pasarela, el disparo debe moverse al
     * momento de pago confirmado (webhook/handler dedicado) y esta llamada debería
     * retirarse o condicionarse según el estado del pedido.
     */
    void this.storeSmsNotifier.notifyStoreForClosedOrder(
      this.toClosedOrderNotifyPayload(order),
    );

    return {
      cart: this.mapCart(cart),
      order: this.mapOrder(order),
    };
  }
}
