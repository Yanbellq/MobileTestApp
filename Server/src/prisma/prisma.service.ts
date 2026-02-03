import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });

    console.log('DB_URL Type:', typeof process.env.DATABASE_URL);
    console.log('DB_URL Value:', process.env.DATABASE_URL);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
