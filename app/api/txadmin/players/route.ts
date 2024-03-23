import { NextRequest, NextResponse } from "next/server";

const GET = async (_req: NextRequest, _res: NextResponse) => {
  try {
    const rawActions = await fetch(`${process.env.TX_API}/players`, {
      cache: "no-cache",
    });

    const actions = await rawActions.json();

    if (actions?.message) {
      return Response.json(
        {
          message: "Failed to fetch players",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(actions);
  } catch (err: any) {
    console.log(err);
    return Response.json(
      {
        message: "Failed to fetch players",
      },
      {
        status: 500,
      }
    );
  }
};

export { GET };
