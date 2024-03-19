import { PrismaClient } from "@prisma/client";

//import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "production" ? undefined : ["query", "error"],
}); /*.$extends(withAccelerate())*/

export { prisma };
