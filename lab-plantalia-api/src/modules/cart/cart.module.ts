import { Module } from '@nestjs/common';
import { CartBll } from './cart.bll';
import { CartController } from './cart.controller';
import { CartDal } from './cart.dal';
import { CartDomainExceptionFilter } from './cart-domain-exception.filter';
import { CartFacade } from './cart.facade';

@Module({
  controllers: [CartController],
  providers: [CartDal, CartBll, CartFacade, CartDomainExceptionFilter],
})
export class CartModule {}
