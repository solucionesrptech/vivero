import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { AnalyticsDal } from '../analytics/analytics.dal';
import { ProductDal } from './product.dal';
import type { ProductCatalogRow } from './product.types';

const FEATURED_SALES_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class ProductBll {
  constructor(
    private readonly dal: ProductDal,
    private readonly analyticsDal: AnalyticsDal,
  ) {}

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

    const dateTo = new Date();
    const dateFrom = new Date(dateTo.getTime() - FEATURED_SALES_WINDOW_MS);

    const topSold = await this.analyticsDal.findTopProductsByQuantitySold(safe, {
      orderStatuses: [OrderStatus.CONFIRMED],
      dateFrom,
      dateTo,
      onlyActiveProducts: true,
    });

    const rankedIds = topSold.map((row) => row.productId);
    const fromSales = await this.dal.findActiveCatalogByIdsPreserveOrder(
      rankedIds,
    );

    if (fromSales.length >= safe) {
      return fromSales.slice(0, safe);
    }

    const excludeIds = fromSales.map((p) => p.id);
    const need = safe - fromSales.length;
    const fallback = await this.dal.findActiveRecentExcluding(excludeIds, need);

    return [...fromSales, ...fallback].slice(0, safe);
  }
}
