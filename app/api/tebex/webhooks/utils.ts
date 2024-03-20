import { createHash, createHmac } from "crypto";

const SECRET = process.env.TEBEX_SECRET ?? "";

const checkSecret = (data: string, tebexSignature: string) => {
  const bodyHash = createHash("sha256").update(data, "utf-8").digest("hex");

  const finalHash = createHmac("sha256", SECRET).update(bodyHash).digest("hex");

  return finalHash === tebexSignature;
};

export { checkSecret };
