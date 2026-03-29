import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { AdminUserRow } from './admin-auth.types';

@Injectable()
export class AdminAuthDal {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<AdminUserRow | null> {
    const row = await this.prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, email: true, passwordHash: true },
    });
    return row;
  }
}
