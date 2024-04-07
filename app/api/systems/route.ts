import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";

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
    Sentry.captureException(err);
  } finally {
    await prisma.$disconnect();
  }

  try {
    const fivem = await fetch(`${process.env.FIVEM_SERVER_URL}/info.json`, {
      cache: "no-store",
    });
    if (fivem.ok) {
      HealthCheck.fivem = true;
    }
  } catch (err) {
    Sentry.captureException(err);
  }

  return Response.json(HealthCheck, {
    status: 200,
  });
};

export { GET };
