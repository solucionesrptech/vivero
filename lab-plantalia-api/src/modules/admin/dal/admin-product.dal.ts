import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { AdminProductCreatedRow, AdminProductListRow } from '../types/admin-product.types';

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
        isActive: true,
      },
    });
    return rows;
  }

  async existsSlug(slug: string): Promise<boolean> {
    const n = await this.prisma.product.count({ where: { slug } });
    return n > 0;
  }

  async insertProduct(params: {
    slug: string;
    categoryId: string;
    name: string;
    shortDescription: string;
    description: string;
    price: number;
    stock: number;
    imageSrc: string;
    imageAlt: string;
    isActive: boolean;
  }): Promise<AdminProductCreatedRow> {
    const row = await this.prisma.product.create({
      data: {
        slug: params.slug,
        categoryId: params.categoryId,
        name: params.name,
        shortDescription: params.shortDescription,
        description: params.description,
        price: params.price,
        stock: params.stock,
        imageSrc: params.imageSrc,
        imageAlt: params.imageAlt,
        isActive: params.isActive,
      },
      select: {
        id: true,
        slug: true,
        categoryId: true,
        name: true,
        shortDescription: true,
        description: true,
        price: true,
        stock: true,
        imageSrc: true,
        imageAlt: true,
        isActive: true,
      },
    });
    return row;
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
        isActive: true,
      },
    });
    return row;
  }
}
