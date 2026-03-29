import { Injectable } from '@nestjs/common';
import { AdminProductDal } from './admin-product.dal';
import { AdminProductDomainError } from './admin-product.domain-error';
import type { AdminProductListRow } from './admin-product.types';

@Injectable()
export class AdminProductBll {
  constructor(private readonly dal: AdminProductDal) {}

  async listProducts(): Promise<AdminProductListRow[]> {
    return this.dal.findAllForAdmin();
  }

  async adjustStock(productId: string, delta: number): Promise<AdminProductListRow> {
    if (!Number.isInteger(delta)) {
      throw new Error('delta debe ser entero');
    }
    const current = await this.dal.findStockById(productId);
    if (current === null) {
      throw new AdminProductDomainError(
        'PRODUCT_NOT_FOUND',
        'Producto no encontrado',
      );
    }
    const newStock = Math.max(0, current + delta);
    return this.dal.updateStock(productId, newStock);
  }
}
