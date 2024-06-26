import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";

const REVALIDATE_TIME = process.env.NODE_ENV === "production" ? 60 : 0;

const fetchMembers = async () => {
  try {
    const raw = await fetch(
      `https://discord.com/api/v9/invites/Xpzj8Eyzhr?with_counts=true&with_expiration=true`,
      {
        next: {
          revalidate: REVALIDATE_TIME,
        },
      }
    );

    const res = await raw.json();

    const { approximate_member_count: members } = res;

    return members;
  } catch (err) {
    Sentry.captureException(err);
    return err;
  }
};

const percentageChange = (yesterday = 0, today = 0) => {
  if (yesterday === 0 && today === 0) {
    return "No data";
  }

  const plusOrMinus = yesterday < today ? "+" : "";

  return String(
    plusOrMinus + Number((today / yesterday) * 100 - 100).toFixed(2)
  ).concat("%");
};

const POST = async (_req: NextRequest, _res: NextResponse) => {
  try {
    const members = await fetchMembers();

    await prisma.brp_web_stats_discord_members.create({
      data: {
        members: members,
      },
    });
    await prisma.$disconnect();
    return Response.json({
      members: members,
      success: true,
    });
  } catch (err: any) {
    Sentry.captureException(err);
    return Response.json({
      members: 0,
      success: false,
      error: err.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

const GET = async (_req: NextRequest, _res: NextResponse) => {
  try {
    const latestToday = await prisma.brp_web_stats_discord_members.findFirst({
      orderBy: {
        timestamp: "desc",
      },
      select: {
        members: true,
      },
    });

    const latestYesterday =
      await prisma.$queryRaw`SELECT \`members\` FROM \`brp_web_stats_discord_members\` WHERE DATE(timestamp) = DATE(NOW() - INTERVAL 1 DAY) ORDER BY \`timestamp\` DESC LIMIT 1;`;

    const percentage = percentageChange(
      // @ts-expect-error
      latestYesterday[0]?.members ?? 0,
      latestToday?.members ?? 0
    );

    await prisma.$disconnect();
    return Response.json({
      success: true,
      error: null,
      data: {
        today: latestToday,
        yesterday: latestYesterday,
        difference: percentage,
      },
    });
  } catch (err: any) {
    Sentry.captureException(err);
    return Response.json({
      success: false,
      error: err.message,
      data: null,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export { POST, GET };
