import { PrismaClient } from "@prisma/client";

//import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "production" ? undefined : ["query", "error"],
  }); /*.$extends(withAccelerate())*/

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
