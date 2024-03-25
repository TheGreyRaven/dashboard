import { NextRequest, NextResponse } from "next/server";

import { CHAT_API_KEY, serverClient } from "@/lib/streamchat";
import * as Sentry from "@sentry/nextjs";

const POST = async (_req: NextRequest, _res: NextResponse) => {
  try {
    const { username } = await _req.json();

    if (!username) {
      return Response.json(
        {
          message: "Missing required data",
        },
        {
          status: 500,
        }
      );
    }

    const token = serverClient.createToken(username);

    return Response.json(
      {
        key: CHAT_API_KEY,
        token: token,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    Sentry.captureException(err);
    return Response.json(
      {
        message: "Invalid post",
      },
      {
        status: 500,
      }
    );
  }
};

export { POST };
