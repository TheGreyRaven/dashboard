import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

interface MoneyInterface {
  bank: number;
  crypto: number;
  cash: number;
}

const GET = async (_req: NextRequest, _res: NextResponse) => {
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

    return Response.json({
      success: true,
      error: null,
      economy: serverEconomy,
    });
  } catch (err: any) {
    return Response.json({
      success: false,
      error: err.message,
      economy: 0,
    });
  } finally {
    prisma.$disconnect();
  }
};

export { GET };
