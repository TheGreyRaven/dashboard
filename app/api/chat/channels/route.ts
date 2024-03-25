import { NextRequest, NextResponse } from "next/server";

import { serverClient } from "@/lib/streamchat";
import * as Sentry from "@sentry/nextjs";

const GET = async (_req: NextRequest, _res: NextResponse) => {
  try {
    const existingChannels: any = [];
    const channels = await serverClient.queryChannels({ type: "messaging" });

    for (let channelndex = 0; channelndex < channels.length; channelndex++) {
      const channel = channels[channelndex];

      const members = await channel.queryMembers({});

      existingChannels.push({
        cid: channel.cid,
        id: channel.id,
        type: channel.type,
        data: channel.data,
        members: members.members,
      });
    }

    channels.map(async (channel) => {
      delete channel.data?.own_capabilities;

      existingChannels.push({
        cid: channel.cid,
        id: channel.id,
        type: channel.type,
        data: channel.data,
      });
    });

    return Response.json(existingChannels, {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    Sentry.captureException(err);
    return Response.json(
      {
        message: "Failed to fetch channels",
      },
      {
        status: 500,
      }
    );
  }
};

export { GET };
