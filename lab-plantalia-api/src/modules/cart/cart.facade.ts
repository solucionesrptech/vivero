import { Injectable } from '@nestjs/common';
import { CartBll } from './cart.bll';
import type { AddCartItemDto } from './dto/add-cart-item.dto';
import type { CartItemResponseDto } from './dto/cart-item-response.dto';
import type { CartResponseDto } from './dto/cart-response.dto';
import type { UpdateCartItemDto } from './dto/update-cart-item.dto';
import type { CartWithItemsRow } from './cart.types';

@Injectable()
export class CartFacade {
  constructor(private readonly bll: CartBll) {}

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

  async checkout(cartId: string): Promise<CartResponseDto> {
    const row = await this.bll.checkout(cartId);
    return this.mapCart(row);
  }
}
