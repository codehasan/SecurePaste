import { PrismaClient } from '@prisma/client';
import { withOptimize } from '@prisma/extension-optimize';

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withOptimize());
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
