import { NextRequest, NextResponse } from "next/server";

const SECRET = process.env.TEBEX_SECRET;

const POST = async (_req: NextRequest, _res: NextResponse) => {
  console.log(_req.body);

  return Response.json("ok");
};

export { POST };
