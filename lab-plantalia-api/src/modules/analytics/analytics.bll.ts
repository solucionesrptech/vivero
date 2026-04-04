import { Injectable } from '@nestjs/common';
import { ORDER_STATUSES_COUNTED_AS_SALES } from '../../domain/order-sales-statuses';
import { AnalyticsDal } from './analytics.dal';
import type { TopProductSoldRow } from './analytics.types';

const TOP_LIMIT = 10;

/**
 * Reglas de negocio analytics:
 * - Solo líneas de órdenes en ORDER_STATUSES_COUNTED_AS_SALES (ver domain/order-sales-statuses.ts).
 */
@Injectable()
export class AnalyticsBll {
  constructor(private readonly dal: AnalyticsDal) {}

  getTopProductsSold(): Promise<TopProductSoldRow[]> {
    return this.dal.findTopProductsByQuantitySold(TOP_LIMIT, {
      orderStatuses: ORDER_STATUSES_COUNTED_AS_SALES,
    });
  }
}
