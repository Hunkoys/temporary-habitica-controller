"use server";

import { getUserId } from "@/app/_utils/auth";
import prisma from "@/prisma/db";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

type Data = {
  egos: {
    title: string;
    stats: string[];
  }[];
  stats: {
    title: string;
    value: number;
  }[];
};
export async function rebuildEgos(data: Data) {
  const userId = getUserId();

  await prisma.ego.deleteMany({
    where: {
      userId,
    },
  });

  await prisma.stat.deleteMany({
    where: {
      userId,
    },
  });

  const { egos, stats } = data;

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      stats: {
        createMany: {
          data: stats,
        },
      },
      egos: {
        createMany: {
          data: egos.map(({ title }) => ({ title })),
        },
      },
    },
  });

  for (const ego of egos) {
    if (ego.stats.length === 0) continue;

    await prisma.ego.update({
      where: {
        userId_title: {
          userId,
          title: ego.title,
        },
      },
      data: {
        stats: {
          connect: ego.stats.map((title) => ({
            userId_title: { userId, title },
          })),
        },
      },
    });
  }
}

const EGO_STAT_SHAPE = {
  egos: {
    select: {
      title: true,
      stats: {
        select: {
          title: true,
        },
      },
    },
  },
  stats: {
    select: {
      title: true,
      value: true,
      egos: {},
    },
  },
};

export type UserEgoPayload = Prisma.UserGetPayload<{
  select: typeof EGO_STAT_SHAPE;
}>;

export async function getEgostats() {
  const user = auth();

  if (user.userId === null) {
    throw new Error("User is not logged in");
  }

  const egostats = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    select: EGO_STAT_SHAPE,
  });

  // if (egostats === null) throw new Error("No egos found");

  return egostats;
}
