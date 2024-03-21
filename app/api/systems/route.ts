import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const GET = async (_req: NextRequest, _res: NextResponse) => {
  const HealthCheck = {
    database: false,
    fivem: false,
    bot: true,
  };

  try {
    await prisma.$connect();
    HealthCheck.database = true;
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }

  try {
    const fivem = await fetch(`${process.env.FIVEM_SERVER_URL}/info.json`);
    if (fivem.ok) {
      HealthCheck.fivem = true;
    }
  } catch (err) {
    console.error(err);
  }

  return Response.json(HealthCheck, {
    status: 200,
  });
};

export { GET };
