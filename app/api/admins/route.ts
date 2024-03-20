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

export { GET };
