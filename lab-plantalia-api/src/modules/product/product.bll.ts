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

  async listFeaturedActive(limit: number): Promise<ProductCatalogRow[]> {
    const n = Number.isFinite(limit) ? Math.floor(limit) : 6;
    const safe = Math.min(Math.max(n, 1), 24);
    return this.dal.findFeaturedActive(safe);
  }
}
