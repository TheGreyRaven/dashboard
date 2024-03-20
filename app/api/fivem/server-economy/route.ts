import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

interface MoneyInterface {
  bank: number;
  crypto: number;
  cash: number;
}

const getServerTotal = async () => {
  let serverEconomy = 0;

  try {
    const data = await prisma.players.findMany({
      select: {
        money: true,
      },
    });

    for (const index in data) {
      const { money } = data[index];
      const { cash, bank, crypto }: MoneyInterface = JSON.parse(money);

      serverEconomy += Number(bank + cash + crypto);
    }

    return {
      success: true,
      error: null,
      economy: serverEconomy,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
      economy: 0,
    };
  } finally {
    prisma.$disconnect();
  }
};

const GET = async (_req: NextRequest, _res: NextResponse) => {
  const { success, error, economy } = await getServerTotal();

  return Response.json({ success, error, economy });
};

const POST = async (_req: NextRequest, _res: NextResponse) => {
  const { success, error, economy } = await getServerTotal();

  if (error) {
    Response.json({
      success: false,
      error: error,
    });
  }

  try {
    await prisma.brp_web_stats_server_money.create({
      data: {
        total_economy: economy,
      },
    });

    return Response.json({
      success: true,
      error: null,
    });
  } catch (err: any) {
    return Response.json({
      success: true,
      error: err.message,
    });
  }
};

export { GET, POST };
