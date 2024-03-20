import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const POST = async (_req: NextRequest, _res: NextResponse) => {
  const raw = await fetch(`${process.env.FIVEM_SERVER_URL}/players.json`);
  const players = await raw.json();
  const currentlyOnline = players.length;

  try {
    await prisma.brp_web_stats_players_online.create({
      data: {
        players_online: currentlyOnline,
      },
    });
  } catch (err: any) {
    console.error(err);
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

export { POST };