import { Injectable } from '@nestjs/common';
import type { ProductQueryDto } from './dto/product-query.dto';
import type { ProductResponseDto } from './dto/product-response.dto';
import { ProductBll } from './product.bll';

@Injectable()
export class ProductFacade {
  constructor(private readonly bll: ProductBll) {}

  async listByCategory(query: ProductQueryDto): Promise<ProductResponseDto[]> {
    const rows = await this.bll.listByCategorySlug(query.categorySlug);
    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      categoryId: r.categoryId,
      name: r.name,
      shortDescription: r.shortDescription,
      description: r.description,
      price: r.price,
      imageSrc: r.imageSrc,
      imageAlt: r.imageAlt,
      stock: r.stock,
    }));
  }

  async listFeatured(limit: number): Promise<ProductResponseDto[]> {
    const rows = await this.bll.listFeaturedActive(limit);
    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      categoryId: r.categoryId,
      name: r.name,
      shortDescription: r.shortDescription,
      description: r.description,
      price: r.price,
      imageSrc: r.imageSrc,
      imageAlt: r.imageAlt,
      stock: r.stock,
    }));
  }
}
