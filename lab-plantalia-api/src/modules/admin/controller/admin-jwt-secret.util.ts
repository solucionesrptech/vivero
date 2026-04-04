/**
 * Secreto JWT admin: en producción obligatorio (ADMIN_JWT_SECRET, ≥32 caracteres).
 * En desarrollo/demo, si falta, se usa un valor fijo local para evitar 500 silenciosos.
 */
export class AdminJwtConfigError extends Error {
  constructor() {
    super(
      'ADMIN_JWT_SECRET no está definido o tiene menos de 32 caracteres. ' +
        'En Render: Environment → añade ADMIN_JWT_SECRET (cadena larga aleatoria) y redeploy.',
    );
    this.name = 'AdminJwtConfigError';
  }
}

export function resolveAdminJwtSecret(): string {
  const fromEnv = process.env.ADMIN_JWT_SECRET?.trim();
  if (fromEnv && fromEnv.length >= 32) {
    return fromEnv;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new AdminJwtConfigError();
  }
  return 'plantalia-local-demo-jwt-secret-no-usar-en-produccion-min-48-chars';
}
