import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { OrderDal } from './dal/order.dal';
import { OrderLookupBll } from './bll/order-lookup.bll';
import { OrderLookupController } from './controller/order-lookup.controller';
import { OrderLookupExceptionFilter } from './controller/order-lookup-exception.filter';
import { OrderLookupFacade } from './facade/order-lookup.facade';
import { OrderLookupRateLimitGuard } from './controller/order-lookup-rate-limit.guard';

@Module({
  imports: [PrismaModule],
  controllers: [OrderLookupController],
  providers: [
    OrderDal,
    OrderLookupBll,
    OrderLookupFacade,
    OrderLookupExceptionFilter,
    OrderLookupRateLimitGuard,
  ],
  exports: [OrderDal],
})
export class OrderModule {}
