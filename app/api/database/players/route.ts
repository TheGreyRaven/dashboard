import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";

const isPlayerOnline = (onlinePlayers: any, license: string) => {
  for (let index = 0; index < onlinePlayers.length; index++) {
    const player = onlinePlayers[index];
    if (player.identifiers.includes(license)) {
      return true;
    }
  }

  return false;
};

const GET = async (_req: NextRequest, _res: NextResponse) => {
  try {
    const raw = await fetch(`${process.env.FIVEM_SERVER_URL}/players.json`);
    const onlinePlayers = await raw.json();

    const players = await prisma.players.findMany({
      select: {
        id: true,
        cid: true,
        license: true,
        name: true,
        charinfo: true,
        last_updated: true,
      },
    });

    for (let index = 0; index < players.length; index++) {
      const player = players[index];
      const charInfo = JSON.parse(player.charinfo!);
      // @ts-ignore
      players[index].online = false;

      players[index].charinfo = `${charInfo.firstname} ${charInfo.lastname}`;

      if (isPlayerOnline(onlinePlayers, player.license)) {
        // @ts-ignore
        players[index].online = true;
      }
    }

    // @ts-ignore
    players.sort((b, a) => a.online - b.online);

    return Response.json(players, {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    Sentry.captureException(err);

    return Response.json(
      {
        message: "Failed to fetch players",
      },
      {
        status: 500,
      }
    );
  }
};

export { GET };
