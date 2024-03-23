import { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";

const GET = async (
  _req: NextRequest,
  { params }: { params: { citizen_id: string } }
) => {
  const citizen_id = params.citizen_id;

  if (!citizen_id) {
    return Response.json(
      {
        message: "Missing required Citizen ID",
      },
      {
        status: 401,
      }
    );
  }

  const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

  try {
    const playerData = await prisma.brp_web_stats_player_economy.findMany({
      where: {
        citizen_id: citizen_id[0],
        timestamp: {
          gte: yesterday,
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    return Response.json(playerData, {
      status: 200,
    });
  } catch (err: any) {
    Sentry.captureException(err);
    return Response.json(
      {
        message: "Failed to fetch citizen data",
        error: err.message,
      },
      {
        status: 500,
      }
    );
  } finally {
    await prisma.$disconnect();
  }
};

export { GET };
