import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { AdminProductListRow } from './admin-product.types';

@Injectable()
export class AdminProductDal {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForAdmin(): Promise<AdminProductListRow[]> {
    const rows = await this.prisma.product.findMany({
      orderBy: [{ categoryId: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        slug: true,
        categoryId: true,
        name: true,
        stock: true,
      },
    });
    return rows;
  }

  async findStockById(productId: string): Promise<number | null> {
    const row = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true },
    });
    if (!row) return null;
    return row.stock;
  }

  async updateStock(productId: string, newStock: number): Promise<AdminProductListRow> {
    const row = await this.prisma.product.update({
      where: { id: productId },
      data: { stock: newStock },
      select: {
        id: true,
        slug: true,
        categoryId: true,
        name: true,
        stock: true,
      },
    });
    return row;
  }
}
