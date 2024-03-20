import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { checkSecret } from "./utils";

const POST = async (_req: NextRequest, _res: NextResponse) => {
  const headersList = headers();
  const tebexSignature = headersList.get("X-Signature") ?? "";
  const test2 = await _req.json();
  const check = checkSecret(test2);
  // const check2 = checkSecret(JSON.stringify(test));

  // console.log(check);
  // console.log(check2);
  console.log({
    check,
    tebexSignature,
  });

  // const headersList = headers();
  // const tebexSignature = headersList.get("X-Signature") ?? "";

  // const isValid = checkSecret(postData);
  // const aaa = checkSecret(test);

  // console.log({
  //   isValid: isValid,
  //   test: aaa,
  //   tebexSignature: tebexSignature,
  // });

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
      id: "ok",
    },
    {
      status: 200,
    }
  );
};

export { POST };
