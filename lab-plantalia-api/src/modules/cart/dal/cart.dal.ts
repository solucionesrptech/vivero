import { Injectable } from '@nestjs/common';
import { Prisma, type DeliveryType } from '@prisma/client';
import { randomInt } from 'node:crypto';

import { PrismaService } from '../../../prisma/prisma.service';
import { CartCheckoutDalError } from './cart.checkout-dal-error';
import type {
  CartItemRow,
  CartWithItemsRow,
  CheckoutOrderInput,
  CheckoutOrderSnapshot,
  ProductRow,
} from '../types/cart.types';

const PUBLIC_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomPublicCode(): string {
  let s = 'P-';
  for (let i = 0; i < 8; i++) {
    s += PUBLIC_CODE_CHARS[randomInt(PUBLIC_CODE_CHARS.length)];
  }
  return s;
}

@Injectable()
export class CartDal {
  constructor(private readonly prisma: PrismaService) {}

  async findProductById(id: string): Promise<ProductRow | null> {
    const row = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true, name: true, price: true, stock: true },
    });
    return row;
  }

  async findCartById(id: string): Promise<{ id: string; total: number } | null> {
    const row = await this.prisma.cart.findUnique({
      where: { id },
      select: { id: true, total: true },
    });
    return row;
  }

  async createCart(): Promise<{ id: string; total: number }> {
    return this.prisma.cart.create({
      data: { total: 0 },
      select: { id: true, total: true },
    });
  }

  async findCartItemByProductId(
    cartId: string,
    productId: string,
  ): Promise<CartItemRow | null> {
    const row = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: { cartId, productId },
      },
    });
    return row
      ? {
          id: row.id,
          cartId: row.cartId,
          productId: row.productId,
          quantity: row.quantity,
          unitPrice: row.unitPrice,
          lineSubtotal: row.lineSubtotal,
        }
      : null;
  }

  async findCartItemById(itemId: string): Promise<CartItemRow | null> {
    const row = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
    });
    return row
      ? {
          id: row.id,
          cartId: row.cartId,
          productId: row.productId,
          quantity: row.quantity,
          unitPrice: row.unitPrice,
          lineSubtotal: row.lineSubtotal,
        }
      : null;
  }

  async createCartItem(params: {
    cartId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    lineSubtotal: number;
  }): Promise<CartItemRow> {
    const row = await this.prisma.cartItem.create({
      data: {
        cartId: params.cartId,
        productId: params.productId,
        quantity: params.quantity,
        unitPrice: params.unitPrice,
        lineSubtotal: params.lineSubtotal,
      },
    });
    return {
      id: row.id,
      cartId: row.cartId,
      productId: row.productId,
      quantity: row.quantity,
      unitPrice: row.unitPrice,
      lineSubtotal: row.lineSubtotal,
    };
  }

  async updateCartItem(
    itemId: string,
    data: { quantity: number; unitPrice: number; lineSubtotal: number },
  ): Promise<CartItemRow> {
    const row = await this.prisma.cartItem.update({
      where: { id: itemId },
      data,
    });
    return {
      id: row.id,
      cartId: row.cartId,
      productId: row.productId,
      quantity: row.quantity,
      unitPrice: row.unitPrice,
      lineSubtotal: row.lineSubtotal,
    };
  }

  async removeCartItem(itemId: string): Promise<void> {
    await this.prisma.cartItem.delete({ where: { id: itemId } });
  }

  async getCartWithItems(cartId: string): Promise<CartWithItemsRow | null> {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      select: { id: true, total: true },
    });
    if (!cart) return null;

    const rows = await this.prisma.cartItem.findMany({
      where: { cartId },
      include: {
        product: { select: { id: true, name: true, price: true, stock: true } },
      },
      orderBy: { id: 'asc' },
    });

    return {
      id: cart.id,
      total: cart.total,
      items: rows.map((i) => ({
        id: i.id,
        cartId: i.cartId,
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        lineSubtotal: i.lineSubtotal,
        product: {
          id: i.product.id,
          name: i.product.name,
          price: i.product.price,
          stock: i.product.stock,
        },
      })),
    };
  }

  async recalculateCartTotal(cartId: string): Promise<number> {
    const agg = await this.prisma.cartItem.aggregate({
      where: { cartId },
      _sum: { lineSubtotal: true },
    });
    const total = agg._sum.lineSubtotal ?? 0;
    await this.prisma.cart.update({
      where: { id: cartId },
      data: { total },
    });
    return total;
  }

  /**
   * Checkout atómico: valida stock con lectura consistente en transacción,
   * descuenta inventario, crea pedido con datos de entrega, vacía líneas y pone total en 0.
   */
  async checkoutCartTransactional(
    cartId: string,
    orderInput: CheckoutOrderInput,
  ): Promise<{ cart: CartWithItemsRow; order: CheckoutOrderSnapshot }> {
    const deliveryType = orderInput.deliveryType;

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const cart = await tx.cart.findUnique({
        where: { id: cartId },
        select: { id: true, total: true },
      });
      if (!cart) {
        throw new CartCheckoutDalError(
          'CART_NOT_FOUND',
          'Carrito no encontrado',
        );
      }

      const items = await tx.cartItem.findMany({
        where: { cartId },
        include: {
          product: { select: { id: true, name: true, stock: true } },
        },
        orderBy: { id: 'asc' },
      });

      if (items.length === 0) {
        throw new CartCheckoutDalError(
          'CART_EMPTY',
          'El carrito está vacío; no hay nada que pagar.',
        );
      }

      for (const item of items) {
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: { gte: item.quantity },
          },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count !== 1) {
          throw new CartCheckoutDalError(
            'STOCK_INSUFFICIENT',
            `No hay stock suficiente para completar la compra de «${item.product.name}». Revisa las cantidades e inténtalo de nuevo.`,
          );
        }
      }

      const orderTotal = items.reduce((sum, i) => sum + i.lineSubtotal, 0);

      const lineCreates = items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        lineSubtotal: i.lineSubtotal,
      }));

      let created: {
        id: string;
        publicCode: string;
        status: string;
        total: number;
        deliveryType: DeliveryType;
        customerName: string;
        customerPhone: string;
        deliveryAddress: string | null;
        items: {
          quantity: number;
          lineSubtotal: number;
          product: { name: string };
        }[];
      } | null = null;

      for (let attempt = 0; attempt < 16; attempt++) {
        const publicCode = randomPublicCode();
        try {
          created = await tx.order.create({
            data: {
              status: 'AWAITING_PREPARATION',
              total: orderTotal,
              deliveryType,
              customerName: orderInput.customerName,
              customerPhone: orderInput.customerPhone,
              deliveryAddress: orderInput.deliveryAddress,
              publicCode,
              items: { create: lineCreates },
            },
            include: {
              items: {
                include: { product: { select: { name: true } } },
                orderBy: { id: 'asc' },
              },
            },
          });
          break;
        } catch (e) {
          if (
            e instanceof Prisma.PrismaClientKnownRequestError &&
            e.code === 'P2002'
          ) {
            continue;
          }
          throw e;
        }
      }

      if (!created) {
        throw new CartCheckoutDalError(
          'PUBLIC_CODE_GENERATION_FAILED',
          'No se pudo generar un código de pedido único. Intenta de nuevo en unos segundos.',
        );
      }

      await tx.cartItem.deleteMany({ where: { cartId } });
      await tx.cart.update({
        where: { id: cartId },
        data: { total: 0 },
      });

      const order: CheckoutOrderSnapshot = {
        id: created.id,
        publicCode: created.publicCode,
        status: created.status,
        total: created.total,
        deliveryType: created.deliveryType,
        customerName: created.customerName,
        customerPhone: created.customerPhone,
        deliveryAddress: created.deliveryAddress,
        lines: created.items.map((i) => ({
          productName: i.product.name,
          quantity: i.quantity,
          lineSubtotal: i.lineSubtotal,
        })),
      };

      return {
        cart: {
          id: cart.id,
          total: 0,
          items: [],
        },
        order,
      };
    });
  }
}
