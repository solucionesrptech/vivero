import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { OrderModule } from '../order/order.module';
import { AdminJwtGuard } from './admin-jwt.guard';
import { AdminAuthBll } from './admin-auth.bll';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthDal } from './admin-auth.dal';
import { AdminAuthFacade } from './admin-auth.facade';
import { AdminOrderBll } from './admin-order.bll';
import { AdminOrderController } from './admin-order.controller';
import { AdminOrderFacade } from './admin-order.facade';
import { AdminProductBll } from './admin-product.bll';
import { AdminProductController } from './admin-product.controller';
import { AdminProductDal } from './admin-product.dal';
import { AdminProductFacade } from './admin-product.facade';

@Module({
  imports: [OrderModule, NotificationsModule],
  controllers: [
    AdminAuthController,
    AdminProductController,
    AdminOrderController,
  ],
  providers: [
    AdminAuthDal,
    AdminAuthBll,
    AdminAuthFacade,
    AdminProductDal,
    AdminProductBll,
    AdminProductFacade,
    AdminOrderBll,
    AdminOrderFacade,
    AdminJwtGuard,
  ],
})
export class AdminModule {}
