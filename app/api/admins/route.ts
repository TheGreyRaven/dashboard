import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";

const DELETE = async (_req: NextRequest, _res: NextResponse) => {
  const { discord_id } = await _req.json();

  if (!discord_id) {
    return Response.json(
      {
        success: false,
        error: "Missing Discord ID",
      },
      {
        status: 400,
      }
    );
  }

  try {
    await prisma.brp_web_admins.delete({
      where: {
        discord_id: discord_id,
      },
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

const GET = async (_req: NextRequest, _res: NextResponse) => {
  try {
    const admins = await prisma.brp_web_admins.findMany();

    return Response.json({
      success: true,
      error: null,
      admins: admins,
    });
  } catch (err: any) {
    Sentry.captureException(err);
    return Response.json(
      {
        success: false,
        error: err.message,
        admins: null,
      },
      {
        status: 200,
      }
    );
  } finally {
    await prisma.$disconnect();
  }
};

const POST = async (_req: NextRequest, _res: NextResponse) => {
  try {
    const { discord_id, permission_level, added_by_name, added_by_id } =
      await _req.json();

    await prisma.brp_web_admins.create({
      data: {
        discord_id: discord_id,
        permission_level: permission_level,
        added_by_name: added_by_name,
        added_by_id: added_by_id,
      },
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

export { GET, POST, DELETE };
