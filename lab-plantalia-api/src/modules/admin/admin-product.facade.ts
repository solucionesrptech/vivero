import { Injectable } from '@nestjs/common';
import type { AdjustStockDto } from './dto/adjust-stock.dto';
import type { AdminProductCreatedDto } from './dto/admin-product-created.dto';
import type { AdminProductRowDto } from './dto/admin-product-row.dto';
import type { CreateAdminProductDto } from './dto/create-admin-product.dto';
import { AdminProductBll } from './admin-product.bll';

@Injectable()
export class AdminProductFacade {
  constructor(private readonly bll: AdminProductBll) {}

  async list(): Promise<AdminProductRowDto[]> {
    const rows = await this.bll.listProducts();
    return rows.map((r) => ({ ...r }));
  }

  async create(dto: CreateAdminProductDto): Promise<AdminProductCreatedDto> {
    const row = await this.bll.createProduct({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      category: dto.category,
      imageUrl: dto.imageUrl,
      isActive: dto.isActive ?? true,
    });
    return { ...row };
  }

  async adjustStock(
    productId: string,
    dto: AdjustStockDto,
  ): Promise<AdminProductRowDto> {
    const row = await this.bll.adjustStock(productId, dto.delta);
    return { ...row };
  }
}
