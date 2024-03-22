import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const GET = async (_req: NextRequest, _res: NextResponse) => {
  try {
    const charactersData = await prisma.players.count();
    const playersData =
      (await prisma.$queryRaw`SELECT COUNT(DISTINCT license) AS unique_players FROM players`) as any;
    const vehiclesData =
      (await prisma.$queryRaw`SELECT COUNT(*) AS vehicles FROM player_vehicles`) as any;
    const housesData =
      (await prisma.$queryRaw`SELECT COUNT(*) AS player_houses FROM player_houses`) as any;

    const players = Number(playersData[0].unique_players);
    const characters = charactersData;
    const vehicles = Number(vehiclesData[0].vehicles);
    const houses = Number(housesData[0].player_houses);

    return Response.json({
      players: players,
      characters: characters,
      vehicles: vehicles,
      houses: houses,
    });
  } catch (err: any) {
    console.error(err);
    return Response.json(
      {
        error: "Failed to fetch data",
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
