import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { ProductCatalogRow } from '../types/product.types';

const catalogFeaturedSelect = {
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
} as const;

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
      select: catalogFeaturedSelect,
    });
    return rows;
  }

  async findActiveCatalogByIdsPreserveOrder(
    ids: string[],
  ): Promise<ProductCatalogRow[]> {
    if (ids.length === 0) {
      return [];
    }
    const rows = await this.prisma.product.findMany({
      where: { id: { in: ids }, isActive: true },
      select: catalogFeaturedSelect,
    });
    const byId = new Map(rows.map((r) => [r.id, r]));
    const ordered: ProductCatalogRow[] = [];
    for (const id of ids) {
      const row = byId.get(id);
      if (row) {
        ordered.push(row);
      }
    }
    return ordered;
  }

  async findActiveRecentExcluding(
    excludeIds: string[],
    take: number,
  ): Promise<ProductCatalogRow[]> {
    const where =
      excludeIds.length > 0
        ? { isActive: true as const, id: { notIn: excludeIds } }
        : { isActive: true as const };

    const rows = await this.prisma.product.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { name: 'asc' }],
      take,
      select: catalogFeaturedSelect,
    });
    return rows;
  }
}
