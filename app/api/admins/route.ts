import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const GET = async (_req: NextRequest, _res: NextResponse) => {
  try {
    const admins = await prisma.brp_web_admins.findMany();

    return Response.json({
      success: true,
      error: null,
      admins: admins,
    });
  } catch (err: any) {
    console.error(err);
    return Response.json({
      success: false,
      error: err.message,
      admins: null,
    });
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

    return Response.json({
      success: true,
      error: null,
    });
  } catch (err: any) {
    console.error(err);
    return Response.json({
      success: false,
      error: err.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export { GET, POST };
