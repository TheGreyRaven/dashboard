import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";

const POST = async (_req: NextRequest, _res: NextResponse) => {
  try {
    const { author, avatar, id, message, source, timestamp } =
      await _req.json();

    await prisma.brp_web_admin_chat_logs.create({
      data: {
        chat_source: source,
        sender_name: author,
        sender_id: id,
        message: message,
        avatar_url: avatar,
        timestamp: timestamp,
      },
    });

    return Response.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(err);
    Sentry.captureException(err);
    return Response.json(
      {
        message: "Failed to save chat message",
      },
      {
        status: 500,
      }
    );
  } finally {
    await prisma.$disconnect();
  }
};

const GET = async (_req: NextRequest, _res: NextResponse) => {
  try {
    const messages = await prisma.brp_web_admin_chat_logs.findMany({
      orderBy: {
        timestamp: "asc",
      },
      take: 100,
    });

    return Response.json(messages, {
      status: 200,
    });
  } catch (err) {
    Sentry.captureException(err);
    return Response.json(
      {
        message: "Failed to fetch chat message",
      },
      {
        status: 500,
      }
    );
  } finally {
    await prisma.$disconnect();
  }
};

export { POST, GET };
