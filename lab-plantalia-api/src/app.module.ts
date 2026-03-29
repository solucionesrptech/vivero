import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './modules/admin/admin.module';
import { CartModule } from './modules/cart/cart.module';
import { ProductModule } from './modules/product/product.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, CartModule, ProductModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
