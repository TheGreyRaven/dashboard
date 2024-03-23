import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";

interface MoneyInterface {
  bank: number;
  crypto: number;
  cash: number;
}

const percentageChange = (yesterday = 0, today = 0) => {
  if (yesterday === 0 && today === 0) {
    return "No data";
  }

  const plusOrMinus = yesterday < today ? "+" : "";

  return String(
    plusOrMinus + Number((today / yesterday) * 100 - 100).toFixed(2)
  ).concat("%");
};

const getServerTotal = async () => {
  let serverEconomy = 0;

  try {
    const data = await prisma.players.findMany({
      select: {
        money: true,
      },
    });

    const totalYesterday =
      await prisma.$queryRaw`SELECT total_economy from brp_web_stats_server_money WHERE \`timestamp\` BETWEEN DATE_SUB(NOW(), INTERVAL 24 HOUR) AND NOW() ORDER BY \`timestamp\` ASC LIMIT 1`;

    //@ts-expect-error
    const { total_economy } = totalYesterday[0];

    for (const index in data) {
      const { money } = data[index];
      const { cash, bank, crypto }: MoneyInterface = JSON.parse(money);

      serverEconomy += Number(bank + cash + crypto);
    }

    return {
      success: true,
      error: null,
      economy: serverEconomy,
      percentage: percentageChange(total_economy, serverEconomy),
    };
  } catch (err: any) {
    Sentry.captureException(err);
    return {
      success: false,
      error: err.message,
      economy: 0,
      percentage: "N/A",
    };
  } finally {
    prisma.$disconnect();
  }
};

const GET = async (_req: NextRequest, _res: NextResponse) => {
  const { success, error, economy, percentage } = await getServerTotal();

  return Response.json({ success, error, economy, percentage });
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
