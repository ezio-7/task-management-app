import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});