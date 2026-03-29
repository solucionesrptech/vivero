import { Injectable } from '@nestjs/common';
import type { AdjustStockDto } from './dto/adjust-stock.dto';
import type { AdminProductRowDto } from './dto/admin-product-row.dto';
import { AdminProductBll } from './admin-product.bll';

@Injectable()
export class AdminProductFacade {
  constructor(private readonly bll: AdminProductBll) {}

  async list(): Promise<AdminProductRowDto[]> {
    const rows = await this.bll.listProducts();
    return rows.map((r) => ({ ...r }));
  }

  async adjustStock(
    productId: string,
    dto: AdjustStockDto,
  ): Promise<AdminProductRowDto> {
    const row = await this.bll.adjustStock(productId, dto.delta);
    return { ...row };
  }
}
