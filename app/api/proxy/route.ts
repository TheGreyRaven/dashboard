import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const GET = async (req: NextRequest, res: NextResponse) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? "";

  try {
    const adminUser = await prisma.brp_web_admins.findFirst({
      where: {
        discord_id: id,
      },
      select: {
        permission_level: true,
      },
    });

    if (adminUser) {
      return Response.json({
        success: true,
        permission_level: adminUser.permission_level,
      });
    }
    await prisma.$disconnect();
    return Response.json({
      success: false,
      permission_level: null,
    });
  } catch (err) {
    console.error(err);
    return Response.json({
      success: false,
      permission_level: null,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export { GET };
