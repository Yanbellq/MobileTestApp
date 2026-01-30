import { CATEGORIES } from '@/shared/data/category.data';
import { PrismaService } from './prisma.service';

const prisma = new PrismaService();

async function up() {
  await prisma.category.createMany({ data: CATEGORIES, skipDuplicates: true });
}

async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "categories" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "offers" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "tasks" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "users" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "profiles" RESTART IDENTITY CASCADE`;
}

export async function main() {
  try {
    await down();
    await up();
    console.log('✅ Seed successful');
  } catch (e) {
    console.log(e);
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
