import '../src/load-env';

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { createPgAdapterFromEnv } from '../src/prisma/pg-adapter';

/**
 * Crea o actualiza un AdminUser sin tocar catálogo ni pedidos.
 * Uso: npm run prisma:create-admin
 * Opcional: ADMIN_CREATE_EMAIL, ADMIN_CREATE_PASSWORD en .env
 *
 * Valores por defecto (cambiar en producción): mismo par que añade prisma/seed.ts
 */
const DEFAULT_EMAIL = 'plantalia.lab@gmail.com';
const DEFAULT_PASSWORD = 'plantalia2027';

async function main(): Promise<void> {
  const email = (
    process.env.ADMIN_CREATE_EMAIL?.trim() || DEFAULT_EMAIL
  ).toLowerCase();
  const password =
    process.env.ADMIN_CREATE_PASSWORD?.trim() || DEFAULT_PASSWORD;
  if (password.length < 8) {
    console.error('La contraseña debe tener al menos 8 caracteres.');
    process.exit(1);
  }

  const { pool, adapter } = createPgAdapterFromEnv();
  const prisma = new PrismaClient({ adapter });
  try {
    const passwordHash = bcrypt.hashSync(password, 10);
    await prisma.adminUser.upsert({
      where: { email },
      create: { email, passwordHash },
      update: { passwordHash },
    });
    console.log(`Admin listo: ${email} (contraseña actualizada si ya existía).`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
