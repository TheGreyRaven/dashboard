import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const GET = async (_req: NextRequest, _res: NextResponse) => {
  try {
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    const playerEconomy = await prisma.brp_web_stats_player_economy.findMany({
      select: {
        license: true,
        citizen_id: true,
        character_id: true,
        character_name: true,
        total_economy: true,
        timestamp: true,
      },
      where: {
        timestamp: {
          gte: yesterday,
        },
      },
      orderBy: {
        timestamp: "asc",
      },
      take: 10,
    });

    return Response.json({
      success: true,
      error: null,
      data: playerEconomy,
    });
  } catch (err: any) {
    console.error(err);
    return Response.json({
      success: false,
      error: err.message,
      data: [],
    });
  } finally {
    await prisma.$disconnect();
  }
};

export { GET };
