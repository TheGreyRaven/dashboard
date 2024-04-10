import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";

const POST = async (_req: NextRequest, _res: NextResponse) => {
  const raw = await fetch(`${process.env.FIVEM_SERVER_URL}/players.json`, {
    cache: "no-store",
  });
  const players = await raw.json();
  const currentlyOnline = players.length;

  try {
    await prisma.brp_web_stats_players_online.create({
      data: {
        players_online: currentlyOnline,
      },
    });
  } catch (err: any) {
    Sentry.captureException(err);
    return Response.json({
      success: false,
      error: err.message,
    });
  } finally {
    await prisma.$disconnect();
  }

  return Response.json({
    success: true,
    error: null,
  });
};

const GET = async (_req: NextRequest, _res: NextResponse) => {
  const url = new URL(_req.url);

  const live = url.searchParams.get("live") ?? false;

  if (live) {
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    const raw = await fetch(`${process.env.FIVEM_SERVER_URL}/players.json`, {
      cache: "no-store",
    });
    const players = await raw.json();

    const max = await prisma.brp_web_stats_players_online.findFirst({
      where: {
        timestamp: {
          gte: yesterday,
        },
      },
      orderBy: {
        players_online: "desc",
      },
    });

    return Response.json({
      today: max?.players_online,
      players: players,
    });
  }

  const history =
    (await prisma.$queryRaw`SELECT * FROM brp_web_stats_players_online ORDER BY \`timestamp\` DESC LIMIT 24`) as any[];
  const correctHistory = history.reverse();

  return Response.json(correctHistory);
};

export { POST, GET };
export const dynamic = "force-dynamic";
