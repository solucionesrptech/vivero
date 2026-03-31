import { Injectable } from '@nestjs/common';
import { PLANTALIA_CATEGORY_SLUGS } from './constants/plantalia-category-slugs';
import { AdminProductDal } from './admin-product.dal';
import { AdminProductDomainError } from './admin-product.domain-error';
import type {
  AdminProductCreatedRow,
  AdminProductListRow,
} from './admin-product.types';

const SHORT_DESCRIPTION_MAX = 160;

function slugifyName(name: string): string {
  const s = name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const base = s.slice(0, 80);
  return base.length > 0 ? base : 'producto';
}

function shortDescriptionFrom(full: string): string {
  const t = full.trim();
  if (t.length <= SHORT_DESCRIPTION_MAX) return t;
  return `${t.slice(0, SHORT_DESCRIPTION_MAX - 1).trimEnd()}…`;
}

@Injectable()
export class AdminProductBll {
  constructor(private readonly dal: AdminProductDal) {}

  async listProducts(): Promise<AdminProductListRow[]> {
    return this.dal.findAllForAdmin();
  }

  /**
   * Crea un producto publicable. Slug derivado del nombre; categoría debe ser un slug Plantalia V1.
   * Filtros por fecha / edición: fuera de alcance V1.
   */
  async createProduct(input: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string;
    isActive: boolean;
  }): Promise<AdminProductCreatedRow> {
    const categoryId = input.category.trim();
    if (!(PLANTALIA_CATEGORY_SLUGS as readonly string[]).includes(categoryId)) {
      throw new AdminProductDomainError(
        'INVALID_CATEGORY_SLUG',
        'Categoría no válida para esta versión del catálogo.',
      );
    }

    const baseSlug = slugifyName(input.name);
    let slug = baseSlug;
    for (let attempt = 0; attempt < 100; attempt++) {
      if (!(await this.dal.existsSlug(slug))) {
        const description = input.description.trim();
        const shortDescription = shortDescriptionFrom(description);
        const imageSrc = input.imageUrl.trim();
        const imageAlt = input.name.trim();

        return this.dal.insertProduct({
          slug,
          categoryId,
          name: input.name.trim(),
          shortDescription,
          description,
          price: input.price,
          stock: input.stock,
          imageSrc,
          imageAlt,
          isActive: input.isActive,
        });
      }
      slug = `${baseSlug}-${attempt + 2}`;
    }

    throw new AdminProductDomainError(
      'DUPLICATE_SLUG',
      'Ya existe un producto con un identificador URL muy similar. Cambia el nombre.',
    );
  }

  async adjustStock(productId: string, delta: number): Promise<AdminProductListRow> {
    if (!Number.isInteger(delta)) {
      throw new Error('delta debe ser entero');
    }
    const current = await this.dal.findStockById(productId);
    if (current === null) {
      throw new AdminProductDomainError(
        'PRODUCT_NOT_FOUND',
        'Producto no encontrado',
      );
    }
    const newStock = Math.max(0, current + delta);
    return this.dal.updateStock(productId, newStock);
  }
}
