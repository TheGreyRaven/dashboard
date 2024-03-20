import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

import { checkSecret } from "./utils";

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const POST = async (_req: NextRequest, _res: NextResponse) => {
  const headersList = headers();
  const tebexSignature = headersList.get("X-Signature") ?? "";
  //@ts-expect-error
  const buf = await buffer(_req.body);
  const rawBody = buf.toString("utf8");

  const test2 = checkSecret(rawBody);

  console.log({
    test2,
    tebexSignature,
  });

  // if (!webhookData.id || !tebexSignature) {
  //   return Response.json(
  //     {
  //       error: "Missing required data",
  //     },
  //     {
  //       status: 400,
  //     }
  //   );
  // }

  // const

  return Response.json(
    {
      id: "ok",
    },
    {
      status: 200,
    }
  );
};

export { POST };
