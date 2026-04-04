import '../src/load-env';

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { createPgAdapterFromEnv } from '../src/prisma/pg-adapter';

/**
 * Crea o actualiza un AdminUser sin tocar catálogo ni pedidos.
 * Uso: npm run prisma:create-admin
 * Opcional: ADMIN_CREATE_EMAIL, ADMIN_CREATE_PASSWORD en .env
 */
async function main(): Promise<void> {
  const email = process.env.ADMIN_CREATE_EMAIL?.trim().toLowerCase() ?? '';
  const password = process.env.ADMIN_CREATE_PASSWORD?.trim() ?? '';
  if (!email || !password) {
    console.error(
      'Debes definir ADMIN_CREATE_EMAIL y ADMIN_CREATE_PASSWORD para crear o actualizar un admin.',
    );
    process.exit(1);
  }
  if (password.length < 12) {
    console.error('La contraseña debe tener al menos 12 caracteres.');
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
