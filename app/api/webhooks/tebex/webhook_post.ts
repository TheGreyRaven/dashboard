import { buffer } from "micro";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { checkSecret } from "./utils";

const POST = async (_req: NextRequest, _res: NextResponse) => {
  //@ts-expect-error
  const postData = (await buffer(_req.body)) as any;
  const headersList = headers();
  const tebexSignature = headersList.get("X-Signature") ?? "";

  const isValid = checkSecret(tebexSignature);

  console.log({
    isValid: isValid,
    tebexSignature: tebexSignature,
  });

  // console.log(postData);

  // const bodyHash = crypto
  //   .createHash("sha256")
  //   .update(postData, "utf-8")
  //   .digest("hex");
  // const finalHash = crypto
  //   .createHmac("sha256", SECRET)
  //   .update(bodyHash)
  //   .digest("hex");
  // console.log("finalHash", finalHash);

  return Response.json(
    {
      id: postData.id,
    },
    {
      status: 200,
    }
  );
};

export { POST };
