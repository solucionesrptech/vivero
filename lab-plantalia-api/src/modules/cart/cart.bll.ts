import { Injectable } from '@nestjs/common';
import type { AddCartItemDto } from './dto/add-cart-item.dto';
import type { UpdateCartItemDto } from './dto/update-cart-item.dto';
import {
  CartCheckoutDalError,
  type CartCheckoutDalErrorCode,
} from './cart.checkout-dal-error';
import { CartDal } from './cart.dal';
import { CartDomainError, type CartDomainErrorKind } from './cart.domain-error';
import type { CartWithItemsRow } from './cart.types';

const CHECKOUT_DAL_TO_DOMAIN: Record<
  CartCheckoutDalErrorCode,
  CartDomainErrorKind
> = {
  CART_NOT_FOUND: 'CART_NOT_FOUND',
  CART_EMPTY: 'CART_EMPTY',
  STOCK_INSUFFICIENT: 'STOCK_INSUFFICIENT',
};

@Injectable()
export class CartBll {
  constructor(private readonly dal: CartDal) {}

  private assertPositiveQuantity(q: number): void {
    if (!Number.isInteger(q) || q < 1) {
      throw new CartDomainError(
        'INVALID_QUANTITY',
        'La cantidad debe ser un entero mayor a cero',
      );
    }
  }

  async addItem(dto: AddCartItemDto): Promise<CartWithItemsRow> {
    this.assertPositiveQuantity(dto.quantity);

    const product = await this.dal.findProductById(dto.productId);
    if (!product) {
      throw new CartDomainError('PRODUCT_NOT_FOUND', 'Producto no encontrado');
    }

    if (dto.quantity > product.stock) {
      throw new CartDomainError(
        'STOCK_INSUFFICIENT',
        'No hay stock suficiente para la cantidad solicitada',
      );
    }

    let cartId: string;
    if (dto.cartId) {
      const existing = await this.dal.findCartById(dto.cartId);
      if (!existing) {
        throw new CartDomainError('CART_NOT_FOUND', 'Carrito no encontrado');
      }
      cartId = existing.id;
    } else {
      const created = await this.dal.createCart();
      cartId = created.id;
    }

    const unitPrice = product.price;
    const line = await this.dal.findCartItemByProductId(cartId, product.id);

    if (line) {
      const newQty = line.quantity + dto.quantity;
      this.assertPositiveQuantity(newQty);
      if (newQty > product.stock) {
        throw new CartDomainError(
          'STOCK_INSUFFICIENT',
          'No hay stock suficiente para la cantidad solicitada',
        );
      }
      const lineSubtotal = unitPrice * newQty;
      await this.dal.updateCartItem(line.id, {
        quantity: newQty,
        unitPrice,
        lineSubtotal,
      });
    } else {
      await this.dal.createCartItem({
        cartId,
        productId: product.id,
        quantity: dto.quantity,
        unitPrice,
        lineSubtotal: unitPrice * dto.quantity,
      });
    }

    await this.dal.recalculateCartTotal(cartId);
    const snapshot = await this.dal.getCartWithItems(cartId);
    if (!snapshot) {
      throw new CartDomainError('CART_NOT_FOUND', 'Carrito no encontrado');
    }
    return snapshot;
  }

  async getCart(cartId: string): Promise<CartWithItemsRow> {
    const cart = await this.dal.getCartWithItems(cartId);
    if (!cart) {
      throw new CartDomainError('CART_NOT_FOUND', 'Carrito no encontrado');
    }
    return cart;
  }

  async updateItem(
    itemId: string,
    cartId: string,
    dto: UpdateCartItemDto,
  ): Promise<CartWithItemsRow> {
    this.assertPositiveQuantity(dto.quantity);

    const line = await this.dal.findCartItemById(itemId);
    if (!line || line.cartId !== cartId) {
      throw new CartDomainError(
        'CART_ITEM_NOT_FOUND',
        'Línea de carrito no encontrada',
      );
    }

    const product = await this.dal.findProductById(line.productId);
    if (!product) {
      throw new CartDomainError('PRODUCT_NOT_FOUND', 'Producto no encontrado');
    }

    const unitPrice = product.price;
    if (dto.quantity > product.stock) {
      throw new CartDomainError(
        'STOCK_INSUFFICIENT',
        'No hay stock suficiente para la cantidad solicitada',
      );
    }
    const lineSubtotal = unitPrice * dto.quantity;
    await this.dal.updateCartItem(itemId, {
      quantity: dto.quantity,
      unitPrice,
      lineSubtotal,
    });
    await this.dal.recalculateCartTotal(cartId);
    const snapshot = await this.dal.getCartWithItems(cartId);
    if (!snapshot) {
      throw new CartDomainError('CART_NOT_FOUND', 'Carrito no encontrado');
    }
    return snapshot;
  }

  async removeItem(itemId: string, cartId: string): Promise<CartWithItemsRow> {
    const line = await this.dal.findCartItemById(itemId);
    if (!line || line.cartId !== cartId) {
      throw new CartDomainError(
        'CART_ITEM_NOT_FOUND',
        'Línea de carrito no encontrada',
      );
    }
    await this.dal.removeCartItem(itemId);
    await this.dal.recalculateCartTotal(cartId);
    const snapshot = await this.dal.getCartWithItems(cartId);
    if (!snapshot) {
      throw new CartDomainError('CART_NOT_FOUND', 'Carrito no encontrado');
    }
    return snapshot;
  }

  /**
   * Checkout V1: validación final de stock y descuento atómico en DAL; vacía el carrito.
   */
  async checkout(cartId: string): Promise<CartWithItemsRow> {
    try {
      return await this.dal.checkoutCartTransactional(cartId);
    } catch (e) {
      if (e instanceof CartCheckoutDalError) {
        throw new CartDomainError(
          CHECKOUT_DAL_TO_DOMAIN[e.code],
          e.message,
        );
      }
      throw e;
    }
  }
}
