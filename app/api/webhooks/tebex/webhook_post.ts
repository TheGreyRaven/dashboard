import { headers } from "next/headers";
import { Readable } from "stream";

import { checkSecret } from "./utils";

import type { NextApiRequest, NextApiResponse } from "next";
async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const POST = async (_req: NextApiRequest, _res: NextApiResponse) => {
  const headersList = headers();
  const tebexSignature = headersList.get("X-Signature") ?? "";
  const buf = await buffer(_req);
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
