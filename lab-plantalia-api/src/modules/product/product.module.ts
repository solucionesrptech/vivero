import { Module } from '@nestjs/common';
import { AnalyticsModule } from '../analytics/analytics.module';
import { ProductBll } from './bll/product.bll';
import { ProductController } from './controller/product.controller';
import { ProductDal } from './dal/product.dal';
import { ProductFacade } from './facade/product.facade';

@Module({
  imports: [AnalyticsModule],
  controllers: [ProductController],
  providers: [ProductDal, ProductBll, ProductFacade],
})
export class ProductModule {}
