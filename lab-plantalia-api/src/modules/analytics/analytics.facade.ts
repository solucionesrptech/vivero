import { Injectable } from '@nestjs/common';
import { AnalyticsBll } from './analytics.bll';
import type { TopProductSoldResponseDto } from './dto/top-product-sold-response.dto';

@Injectable()
export class AnalyticsFacade {
  constructor(private readonly bll: AnalyticsBll) {}

  async topProductsSold(): Promise<TopProductSoldResponseDto[]> {
    return this.bll.getTopProductsSold();
  }
}
