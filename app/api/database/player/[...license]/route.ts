//@ts-nocheck

import { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";

const GET = async (
  _req: NextRequest,
  { params }: { params: { license: string } }
) => {
  const { license: data } = params;

  const license = data[0];
  const char_id = Number(data[1]);

  if (!license || !char_id) {
    return Response.json(
      {
        message: "Missing required data",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const tmp = [];
    const character = await prisma.players.findFirst({
      where: {
        license: license,
        cid: char_id,
      },
    });

    const data = {
      citizenid: character?.citizenid,
      cid: character?.cid,
      license: character?.license,
      name: character?.name,
      money: JSON.parse(character.money),
      charinfo: JSON.parse(character.charinfo),
      job: JSON.parse(character.job),
      gang: JSON.parse(character.gang),
      position: JSON.parse(character.position),
      metadata: JSON.parse(character.metadata),
      inventory: JSON.parse(character.inventory),
      last_updated: character.last_updated,
      phone_number: character.phone_number,
      iban: character.iban,
      pincode: character.pincode,
      crafting_level: character.crafting_level,
      credits: character.credits,
      tasks: character.tasks,
      tasks_completed: character.tasks_completed,
      winnings: character.winnings,
      wheel: character.wheel,
      inside: character.inside,
      shell_garage: character.shell_garage,
      ownedskills: JSON.parse(character.ownedskills),
      skillsinfo: JSON.parse(character.skillsinfo),
    };

    return Response.json(JSON.stringify(data, null, 4), {
      status: 200,
    });
  } catch (err) {
    Sentry.captureException(err);
    return Response.json(
      {
        message: "Failed to fetch data",
      },
      {
        status: 500,
      }
    );
  } finally {
    await prisma.$disconnect();
  }
};

export { GET };
