import { NextRequest, NextResponse } from "next/server";

import * as Sentry from "@sentry/nextjs";

const GET = async (_req: NextRequest, _res: NextResponse) => {
  try {
    const rawActions = await fetch(`${process.env.TX_API}/admins`, {
      cache: "no-store",
    });

    const actions = await rawActions.json();

    if (actions?.message) {
      return Response.json(
        {
          message: "Failed to fetch admins",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(actions);
  } catch (err: any) {
    Sentry.captureException(err);
    return Response.json(
      {
        message: "Failed to fetch admins",
      },
      {
        status: 500,
      }
    );
  }
};

export { GET };
export const dynamic = "force-dynamic";
