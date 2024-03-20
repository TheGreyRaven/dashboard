import * as crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const SECRET = process.env.TEBEX_SECRET;

const POST = async (_req: NextRequest, _res: NextResponse) => {
  const postData = await _req.json();
  console.log(postData);

  // const bodyHash = crypto
  //   .createHash("sha256")
  //   .update(_req.body, "utf-8")
  //   .digest("hex");
  // const finalHash = crypto
  //   .createHmac("sha256", secret)
  //   .update(bodyHash)
  //   .digest("hex");
  // console.log("finalHash", finalHash);

  return Response.json("ok", {
    status: 200,
  });
};

export { POST };
