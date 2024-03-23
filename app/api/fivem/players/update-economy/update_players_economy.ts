import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";

interface CharMoney {
  bank: number;
  cash: number;
  crypto: number;
}

interface CharInfo {
  firstname: string;
  lastname: string;
  cid: number;
}

const POST = async (_req: NextRequest, _res: NextResponse) => {
  try {
    const updateData: {
      license: string;
      citizen_id: string;
      character_id: number | null;
      character_name: string;
      total_economy: number;
    }[] = [];
    const players = await prisma.players.findMany({
      select: {
        license: true,
        citizenid: true,
        charinfo: true,
        cid: true,
        money: true,
      },
    });

    players.map((player) => {
      const { citizenid, charinfo, cid, money, license } = player;
      const characterInfo = JSON.parse(charinfo!) as CharInfo;
      const characterMoney = JSON.parse(money) as CharMoney;
      const economy =
        characterMoney.bank + characterMoney.cash + characterMoney.crypto;
      const playerName = String(
        `${characterInfo.firstname} ${characterInfo.lastname}`
      );

      updateData.push({
        license: license,
        citizen_id: citizenid,
        character_id: cid,
        character_name: playerName,
        total_economy: economy,
      });
    });

    await prisma.brp_web_stats_player_economy.createMany({
      data: updateData,
    });

    return Response.json(
      {
        success: true,
        error: null,
      },
      {
        status: 200,
      }
    );
  } catch (err: any) {
    Sentry.captureException(err);
    return Response.json(
      {
        success: false,
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

export { POST };
