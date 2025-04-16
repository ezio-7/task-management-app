// src/tests/setup.ts
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// Clean up database before all tests
beforeAll(async () => {
  // Delete in the correct order to respect foreign key constraints
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
});

// Clean up database after all tests
afterAll(async () => {
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});