import { Module } from '@nestjs/common';
import { AnalyticsModule } from '../analytics/analytics.module';
import { ProductBll } from './product.bll';
import { ProductController } from './product.controller';
import { ProductDal } from './product.dal';
import { ProductFacade } from './product.facade';

@Module({
  imports: [AnalyticsModule],
  controllers: [ProductController],
  providers: [ProductDal, ProductBll, ProductFacade],
})
export class ProductModule {}
