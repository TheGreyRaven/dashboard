import { buffer } from "micro";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { checkSecret } from "./utils";

const POST = async (_req: NextRequest, _res: NextResponse) => {
  const headersList = headers();
  const tebexSignature = headersList.get("X-Signature") ?? "";
  const webhookData = await _req.text();

  // @ts-expect-error
  const buf = await buffer(_req);

  const test2 = checkSecret(webhookData);

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
