import { PrismaClient } from '@prisma/client';
import { config } from '../config';

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

export default prisma;
