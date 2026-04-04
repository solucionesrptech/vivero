import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { OrderModule } from '../order/order.module';
import { AdminJwtGuard } from './controller/admin-jwt.guard';
import { AdminAuthBll } from './bll/admin-auth.bll';
import { AdminAuthController } from './controller/admin-auth.controller';
import { AdminAuthDal } from './dal/admin-auth.dal';
import { AdminAuthFacade } from './facade/admin-auth.facade';
import { AdminDomainExceptionFilter } from './controller/admin-domain-exception.filter';
import { AdminLoginRateLimitGuard } from './controller/admin-login-rate-limit.guard';
import { AdminJwtService } from './controller/admin-jwt.service';
import { AdminOrderBll } from './bll/admin-order.bll';
import { AdminOrderController } from './controller/admin-order.controller';
import { AdminOrderFacade } from './facade/admin-order.facade';
import { AdminProductBll } from './bll/admin-product.bll';
import { AdminProductController } from './controller/admin-product.controller';
import { AdminProductDal } from './dal/admin-product.dal';
import { AdminProductFacade } from './facade/admin-product.facade';

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
    AdminDomainExceptionFilter,
    AdminLoginRateLimitGuard,
    AdminJwtService,
    AdminProductDal,
    AdminProductBll,
    AdminProductFacade,
    AdminOrderBll,
    AdminOrderFacade,
    AdminJwtGuard,
  ],
  exports: [AdminJwtService, AdminJwtGuard],
})
export class AdminModule {}
