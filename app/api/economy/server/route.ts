import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const parseJson = (json: any) => {
  try {
    const data = JSON.parse(json);
    return data;
  } catch (error) {
    console.log(error);
  }
  return {
    bank: 0,
  };
};

const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const data = await prisma.players.findMany({
      select: {
        money: true,
        inventory: true,
      },
    });

    let serverEconomy = 0;

    for (const index in data) {
      try {
        const { money, inventory } = data[index];

        const balance = parseJson(money);
        const { bank } = balance;

        const inv = parseJson(inventory);
        let cash = 0;

        for (const index in inv) {
          const pInv = inv[index];

          if (pInv?.name === "cash") {
            cash = pInv?.amount;
          }
        }

        serverEconomy += Math.floor(bank + cash);
      } catch (err) {
        console.log(err);
      }
    }

    return Response.json(serverEconomy);
  } catch (err) {}

  return Response.json("ok");
};

export { GET };
