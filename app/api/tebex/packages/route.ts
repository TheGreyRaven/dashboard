import { NextRequest, NextResponse } from "next/server";

import * as Sentry from "@sentry/nextjs";

const TEBEX_URL = `https://headless.tebex.io/api/accounts/${process.env.TEBEX_PUBLIC_KEY}/categories?includePackages=1`;

const GET = async (_req: NextRequest, _res: NextResponse) => {
  try {
    const tebexRaw = await fetch(TEBEX_URL, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const { data } = await tebexRaw.json();

    return Response.json(data, {
      status: 200,
    });
  } catch (err: any) {
    Sentry.captureException(err);

    return Response.json(
      {
        message: "Failed to fetch Tebex packages",
      },
      {
        status: 500,
      }
    );
  }
};

export { GET };
export const dynamic = "force-dynamic";
