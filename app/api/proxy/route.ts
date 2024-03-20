import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const POST = async (_req: NextRequest, _res: NextResponse) => {
  const url = new URL(_req.url);
  const id = url.searchParams.get("id") ?? "";
  const data = await _req.json();

  try {
    const adminUser = await prisma.brp_web_admins.findFirst({
      where: {
        discord_id: id,
      },
      select: {
        permission_level: true,
        discord_email: true,
        discord_name: true,
      },
    });

    if (adminUser) {
      if (!adminUser.discord_email || !adminUser.discord_name) {
        try {
          await prisma.brp_web_admins.update({
            where: {
              discord_id: id,
            },
            data: {
              discord_email: data.discord_email,
              discord_name: data.discord_name,
            },
          });
        } catch (err) {
          console.error(err);
        }
      }

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

export { POST };
