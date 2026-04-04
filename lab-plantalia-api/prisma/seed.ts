import '../src/load-env';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { createPgAdapterFromEnv } from '../src/prisma/pg-adapter';

const { pool, adapter } = createPgAdapterFromEnv();
const prisma = new PrismaClient({ adapter });

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
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  const demoEmail = 'user@example.com';
  const demoPassword = 'password123';
  const passwordHash = bcrypt.hashSync(demoPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: demoEmail },
    create: { email: demoEmail, passwordHash },
    update: { passwordHash },
  });

  const sharedAdminEmail = 'plantalia.lab@gmail.com';
  const sharedAdminPassword = 'plantalia2027';
  const sharedAdminHash = bcrypt.hashSync(sharedAdminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: sharedAdminEmail },
    create: { email: sharedAdminEmail, passwordHash: sharedAdminHash },
    update: { passwordHash: sharedAdminHash },
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

  const sampleA = catalog[0];
  const sampleB = catalog[1];
  if (sampleA && sampleB) {
    const lineA = sampleA.price;
    const lineB = sampleB.price * 2;
    await prisma.order.create({
      data: {
        status: 'CONFIRMED',
        total: lineA + lineB,
        items: {
          create: [
            {
              productId: sampleA.id,
              quantity: 1,
              unitPrice: sampleA.price,
              lineSubtotal: lineA,
            },
            {
              productId: sampleB.id,
              quantity: 2,
              unitPrice: sampleB.price,
              lineSubtotal: lineB,
            },
          ],
        },
      },
    });
    await prisma.product.update({
      where: { id: sampleA.id },
      data: { stock: { decrement: 1 } },
    });
    await prisma.product.update({
      where: { id: sampleB.id },
      data: { stock: { decrement: 2 } },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
