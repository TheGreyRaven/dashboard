import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

interface GraphMoney {
  timestamp: Date;
  total_economy: number;
}

const GET = async (_req: NextRequest, _res: NextResponse) => {
  try {
    const data = await prisma.$queryRaw`
        SELECT 
          DATE_FORMAT(\`timestamp\`, '%H:%i') AS time, \`total_economy\`
        FROM
            (SELECT @row:=0) temp, 
            brp_web_stats_server_money 
        WHERE (@row:=@row + 1) % 2 = 1 AND timestamp > (NOW() - INTERVAL 24 HOUR) ORDER BY \`timestamp\` ASC
      `;

    return Response.json({
      success: true,
      error: null,
      data: data,
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
