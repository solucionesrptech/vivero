import { Injectable } from '@nestjs/common';
import { ProductDal } from './product.dal';
import type { ProductCatalogRow } from './product.types';

@Injectable()
export class ProductBll {
  constructor(private readonly dal: ProductDal) {}

  async listByCategorySlug(categorySlug: string): Promise<ProductCatalogRow[]> {
    const trimmed = categorySlug.trim();
    if (!trimmed) {
      return [];
    }
    return this.dal.findByCategorySlug(trimmed);
  }
}
