import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

type CatalogSeedRow = {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  stock: number;
};

const catalogPath = join(__dirname, 'catalog-seed.json');
const catalog: CatalogSeedRow[] = JSON.parse(
  readFileSync(catalogPath, 'utf-8'),
) as CatalogSeedRow[];

async function main(): Promise<void> {
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();

  const demoEmail = 'user@example.com';
  const demoPassword = 'password123';
  const passwordHash = bcrypt.hashSync(demoPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: demoEmail },
    create: { email: demoEmail, passwordHash },
    update: { passwordHash },
  });

  for (const p of catalog) {
    await prisma.product.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        slug: p.slug,
        categoryId: p.categoryId,
        name: p.name,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price,
        imageSrc: p.imageSrc,
        imageAlt: p.imageAlt,
        stock: p.stock,
      },
      update: {
        slug: p.slug,
        categoryId: p.categoryId,
        name: p.name,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price,
        imageSrc: p.imageSrc,
        imageAlt: p.imageAlt,
        stock: p.stock,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
