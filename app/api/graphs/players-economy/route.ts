import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";

const GET = async (_req: NextRequest, _res: NextResponse) => {
  try {
    const topPlayers = await prisma.$queryRaw`
      WITH TopPlayers AS (
        SELECT 
            t1.citizen_id,
            t1.character_id,
            t1.character_name,
            t1.total_economy
        FROM 
            brp_web_stats_player_economy AS t1
        JOIN (
            SELECT 
                citizen_id,
                character_id,
                MAX(timestamp) AS latest_timestamp
            FROM 
                brp_web_stats_player_economy
            WHERE 
                timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            GROUP BY 
                citizen_id,
                character_id
        ) AS t2
        ON 
            t1.citizen_id = t2.citizen_id
            AND t1.character_id = t2.character_id
            AND t1.timestamp = t2.latest_timestamp
        ORDER BY 
            t1.total_economy DESC
        LIMIT 10
    )
    SELECT 
        t1.citizen_id,
        t1.character_id,
        t1.character_name,
        t1.total_economy,
        t1.timestamp
    FROM 
        brp_web_stats_player_economy AS t1
    JOIN TopPlayers AS t2
    ON 
        t1.citizen_id = t2.citizen_id
        AND t1.character_id = t2.character_id
        AND t1.timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    ORDER BY 
        t1.citizen_id,
        t1.character_id,
        t1.timestamp DESC;
    `;
    return Response.json({
      success: true,
      error: null,
      data: topPlayers,
    });
  } catch (err: any) {
    Sentry.captureException(err);
    return Response.json({
      success: false,
      error: err.message,
      data: [],
    });
  } finally {
    await prisma.$disconnect();
  }
};

export { GET };
