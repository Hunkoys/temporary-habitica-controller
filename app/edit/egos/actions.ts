"use server";

import { ifLoggedIn } from "@/app/_utils/bouncer";
import prisma from "@/prisma/db";

export async function createStat(title: string, value: number) {
  return await ifLoggedIn((id) => {
    return prisma.user.update({
      where: {
        id,
      },

      data: {
        stats: {
          create: {
            title,
            value,
          },
        },
      },
    });
  });
}

export async function createEgo(title: string) {
  return await ifLoggedIn((id) => {
    return prisma.user.update({
      where: {
        id,
      },

      data: {
        egos: {
          create: {
            title,
          },
        },
      },
    });
  });
}

export async function linkStatToEgo(statId: string, egoId: string) {
  return await ifLoggedIn((id) => {
    return prisma.user.update({
      where: {
        id,
      },

      data: {
        stats: {
          update: {
            where: {
              id: statId,
            },
            data: {
              egos: {
                connect: {
                  id: egoId,
                },
              },
            },
          },
        },
      },
    });
  });
}
