import { Injectable } from '@nestjs/common';
import { ORDER_STATUSES_COUNTED_AS_SALES } from '../../../domain/order-sales-statuses';
import { AnalyticsDal, type TopProductsDalFilter } from '../dal/analytics.dal';
import type { TopProductSoldRow } from '../types/analytics.types';

const TOP_LIMIT = 10;

/**
 * Reglas de negocio analytics:
 * - Solo líneas de órdenes en ORDER_STATUSES_COUNTED_AS_SALES (ver domain/order-sales-statuses.ts).
 */
@Injectable()
export class AnalyticsBll {
  constructor(private readonly dal: AnalyticsDal) {}

  getTopProductsSold(): Promise<TopProductSoldRow[]> {
    return this.getTopProductsSoldWithFilter(TOP_LIMIT, {});
  }

  getTopProductsSoldWithFilter(
    limit: number,
    filter: Omit<TopProductsDalFilter, 'orderStatuses'>,
  ): Promise<TopProductSoldRow[]> {
    return this.dal.findTopProductsByQuantitySold(limit, {
      orderStatuses: ORDER_STATUSES_COUNTED_AS_SALES,
      ...filter,
    });
  }
}
