import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { checkSecret } from "./utils";

const POST = async (_req: NextRequest, _res: NextResponse) => {
  const headersList = headers();
  const tebexSignature = headersList.get("X-Signature") ?? "";
  const postBody = await _req.text();
  const isValid = checkSecret(postBody, tebexSignature);

  if (!isValid) {
    return Response.json(
      {
        message:
          "Invalid webhook secret, please make sure you have the correct webhook secret",
      },
      {
        status: 403,
      }
    );
  }

  const tebexData = JSON.parse(postBody);

  if (tebexData.type === "validation.webhook") {
    return Response.json(
      {
        id: tebexData.id,
      },
      {
        status: 200,
      }
    );
  }

  try {
    await prisma.brp_web_tebex_transactions.create({
      data: {
        transaction_id: tebexData.subject.transaction_id,
        status: JSON.stringify(tebexData.subject.status),
        created_at: tebexData.subject.created_at,
        price_paid: JSON.stringify(tebexData.subject.price_paid),
        payment_method: JSON.stringify(tebexData.subject.payment_method),
        customer: JSON.stringify(tebexData.subject.customer),
        products: JSON.stringify(tebexData.subject.products),
      },
    });
  } catch (err: any) {
    console.error(err);
    return Response.json({
      message: "Failed to add transaction",
      error: err.message,
    });
  } finally {
    prisma.$disconnect();
  }

  return Response.json(
    {
      id: tebexData.id,
    },
    {
      status: 200,
    }
  );
};

export { POST };
