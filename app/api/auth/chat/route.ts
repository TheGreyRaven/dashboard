import { NextRequest, NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

const CHAT_API_KEY = process.env.CHAT_API_KEY ?? "";
const CHAT_API_SECRET = process.env.CHAT_API_SECRET ?? "";

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
    const serverClient = StreamChat.getInstance(CHAT_API_KEY, CHAT_API_SECRET);

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
