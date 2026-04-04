import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { CartBll } from './bll/cart.bll';
import { CartCheckoutRateLimitGuard } from './controller/cart-checkout-rate-limit.guard';
import { CartController } from './controller/cart.controller';
import { CartDal } from './dal/cart.dal';
import { CartDomainExceptionFilter } from './controller/cart-domain-exception.filter';
import { CartFacade } from './facade/cart.facade';

@Module({
  imports: [NotificationsModule],
  controllers: [CartController],
  providers: [
    CartDal,
    CartBll,
    CartFacade,
    CartDomainExceptionFilter,
    CartCheckoutRateLimitGuard,
  ],
})
export class CartModule {}
