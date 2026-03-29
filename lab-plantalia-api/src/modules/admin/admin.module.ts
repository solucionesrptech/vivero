import { Module } from '@nestjs/common';
import { AdminJwtGuard } from './admin-jwt.guard';
import { AdminAuthBll } from './admin-auth.bll';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthDal } from './admin-auth.dal';
import { AdminAuthFacade } from './admin-auth.facade';
import { AdminProductBll } from './admin-product.bll';
import { AdminProductController } from './admin-product.controller';
import { AdminProductDal } from './admin-product.dal';
import { AdminProductFacade } from './admin-product.facade';

@Module({
  controllers: [AdminAuthController, AdminProductController],
  providers: [
    AdminAuthDal,
    AdminAuthBll,
    AdminAuthFacade,
    AdminProductDal,
    AdminProductBll,
    AdminProductFacade,
    AdminJwtGuard,
  ],
})
export class AdminModule {}
