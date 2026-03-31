import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { ProductCatalogRow } from './product.types';

@Injectable()
export class ProductDal {
  constructor(private readonly prisma: PrismaService) {}

  async findByCategorySlug(categorySlug: string): Promise<ProductCatalogRow[]> {
    const rows = await this.prisma.product.findMany({
      where: { categoryId: categorySlug, isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        slug: true,
        categoryId: true,
        name: true,
        shortDescription: true,
        description: true,
        price: true,
        imageSrc: true,
        imageAlt: true,
        stock: true,
      },
    });
    return rows;
  }

  async findFeaturedActive(limit: number): Promise<ProductCatalogRow[]> {
    const rows = await this.prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ createdAt: 'desc' }, { name: 'asc' }],
      take: limit,
      select: {
        id: true,
        slug: true,
        categoryId: true,
        name: true,
        shortDescription: true,
        description: true,
        price: true,
        imageSrc: true,
        imageAlt: true,
        stock: true,
      },
    });
    return rows;
  }
}
