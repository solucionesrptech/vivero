import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { OrderDal } from './order.dal';
import { OrderLookupBll } from './order-lookup.bll';
import { OrderLookupController } from './order-lookup.controller';
import { OrderLookupExceptionFilter } from './order-lookup-exception.filter';
import { OrderLookupFacade } from './order-lookup.facade';

@Module({
  imports: [PrismaModule],
  controllers: [OrderLookupController],
  providers: [
    OrderDal,
    OrderLookupBll,
    OrderLookupFacade,
    OrderLookupExceptionFilter,
  ],
  exports: [OrderDal],
})
export class OrderModule {}
