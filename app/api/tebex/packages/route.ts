import { NextRequest, NextResponse } from "next/server";

const TEBEX_URL = `https://headless.tebex.io/api/accounts/${process.env.TEBEX_PUBLIC_KEY}/categories?includePackages=1`;

const GET = async (_req: NextRequest, _res: NextResponse) => {
  const tebexRaw = await fetch(TEBEX_URL, {
    headers: {
      Accept: "application/json",
    },
  });

  const { data } = await tebexRaw.json();

  return Response.json(data, {
    status: 200,
  });
};

export { GET };
