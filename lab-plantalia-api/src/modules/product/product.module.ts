import { Module } from '@nestjs/common';
import { ProductBll } from './product.bll';
import { ProductController } from './product.controller';
import { ProductDal } from './product.dal';
import { ProductFacade } from './product.facade';

@Module({
  controllers: [ProductController],
  providers: [ProductDal, ProductBll, ProductFacade],
})
export class ProductModule {}
