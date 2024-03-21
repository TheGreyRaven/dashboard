import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const GET = async (_req: NextRequest, _res: NextResponse) => {
  try {
    const formatedData: {
      citizenid: string;
      cid: number | null;
      license: string;
      charinfo: any;
      money: any;
      job: any;
    }[] = [];
    const players = await prisma.players.findMany({
      select: {
        citizenid: true,
        cid: true,
        license: true,
        name: true,
        money: true,
        charinfo: true,
        job: true,
      },
    });

    players.map((player) => {
      const job = JSON.parse(player.job);
      const money = JSON.parse(player.money);
      const charinfo = JSON.parse(player.charinfo!);

      formatedData.push({
        citizenid: player.citizenid,
        cid: player.cid,
        license: player.license,
        charinfo: charinfo,
        money: money,
        job: job,
      });
    });

    return Response.json(formatedData, {
      status: 200,
    });
  } catch (err: any) {
    console.error(err);

    return Response.json(
      {
        message: "Failed to fetch data",
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
