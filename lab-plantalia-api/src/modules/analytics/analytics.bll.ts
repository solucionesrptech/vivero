import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { AnalyticsDal } from './analytics.dal';
import type { TopProductSoldRow } from './analytics.types';

const TOP_LIMIT = 10;

/**
 * Reglas de negocio analytics V1:
 * - Solo líneas pertenecientes a órdenes en estados considerados "venta cerrada".
 * - V1: únicamente CONFIRMED (checkout exitoso persiste con este estado).
 * - Filtro por fecha: reservado en DAL; la BLL podrá pasar rango en V2 sin cambiar contrato del controller.
 */
@Injectable()
export class AnalyticsBll {
  constructor(private readonly dal: AnalyticsDal) {}

  getTopProductsSold(): Promise<TopProductSoldRow[]> {
    return this.dal.findTopProductsByQuantitySold(TOP_LIMIT, {
      orderStatuses: [OrderStatus.CONFIRMED],
    });
  }
}
