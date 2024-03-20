import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

interface GraphMoney {
  timestamp: Date;
  total_economy: number;
}

const GET = async (_req: NextRequest, _res: NextResponse) => {
  try {
    const data =
      await prisma.$queryRaw`SELECT DATE_FORMAT(\`timestamp\`, '%H:%i') AS timestamp, \`total_economy\` FROM brp_web_stats_server_money WHERE timestamp > (NOW() - INTERVAL 24 HOUR) ORDER BY \`timestamp\` ASC`;

    // @ts-expect-error
    const sorted = data?.sort((x: GraphMoney, y: GraphMoney) => {
      return new Date(x.timestamp) < new Date(y.timestamp);
    });

    return Response.json({
      success: true,
      error: null,
      data: sorted,
    });
  } catch (err: any) {
    console.error(err);
    return Response.json({
      success: false,
      error: err.message,
      data: null,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export { GET };
