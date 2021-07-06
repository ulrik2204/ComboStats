import { PrismaClient } from '@prisma/client';

// add prisma to the NodeJS global type
declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}
declare const global: NodeJS.Global;

// Prevent multiple instances of Prisma Client in development

let prisma = global.prisma || new PrismaClient();

if (typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient()
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient()
    }
    prisma = global.prisma
  }
}

export default prisma;
