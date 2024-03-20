import * as crypto from "crypto";

const SECRET = process.env.TEBEX_SECRET ?? "";

const checkSecret = (secret: string) => {
  const bodyHash = crypto
    .createHash("sha256")
    .update(secret, "utf-8")
    .digest("hex");

  const finalHash = crypto
    .createHmac("sha256", SECRET)
    .update(bodyHash)
    .digest("hex");

  return finalHash;
};

export { checkSecret };
