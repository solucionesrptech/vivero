/**
 * Debe importarse antes que AppModule / Prisma.
 * Resuelve la raíz del paquete API aunque el código corra desde dist/src/ (Nest build).
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { config } from 'dotenv';

function findApiPackageRoot(startDir: string): string {
  let dir = startDir;
  for (let i = 0; i < 10; i++) {
    const pkgPath = resolve(dir, 'package.json');
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
          name?: string;
        };
        if (pkg.name === 'lab-plantalia-api') {
          return dir;
        }
      } catch {
        /* ignore */
      }
    }
    const parent = dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  return resolve(startDir, '..', '..');
}

const packageRoot = findApiPackageRoot(__dirname);

for (const name of ['.env', '.env.local'] as const) {
  const p = resolve(packageRoot, name);
  if (existsSync(p)) {
    config({ path: p, override: true });
  }
}

// cwd: sin pisar variables ya cargadas desde la raíz del paquete (p. ej. DATABASE_URL).
for (const name of ['.env', '.env.local'] as const) {
  const p = resolve(process.cwd(), name);
  if (existsSync(p)) {
    config({ path: p, override: false });
  }
}
