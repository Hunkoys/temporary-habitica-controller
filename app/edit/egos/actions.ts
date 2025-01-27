"use server";

import { getUserId } from "@/app/_utils/auth";
import prisma from "@/prisma/db";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createEgo(title: string) {
  setTimeout(() => {
    revalidatePath("/edit");
  }, 500);

  return await prisma.user.update({
    where: {
      id: getUserId(),
    },

    data: {
      egos: {
        create: {
          title,
        },
      },
    },
  });
}

export async function deleteEgo(id: string) {
  const ego = await prisma.ego.findUnique({
    where: {
      id,
    },
  });

  if (ego?.userId !== getUserId()) throw new Error("You do not own this ego");

  revalidatePath("/edit");

  return prisma.ego.delete({
    where: {
      id,
    },
  });
}

export async function createStat(title: string, value: number) {
  revalidatePath("/edit");

  return prisma.user.update({
    where: {
      id: getUserId(),
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
}

export async function deleteStats(ids: string[] | string) {
  if (typeof ids === "string") ids = [ids];

  revalidatePath("/edit");

  return prisma.stat.deleteMany({
    where: {
      userId: getUserId(),
      id: { in: ids },
    },
  });
}

export async function assignStat(egoId: string, statIds: string[]) {
  revalidatePath("/edit");

  return prisma.ego.update({
    where: {
      id: egoId,
    },
    data: {
      stats: {
        connect: statIds.map((id) => ({ id })),
      },
    },
  });
}

const EGO_STAT_SHAPE = {
  egos: {
    select: {
      id: true,
      title: true,
      stats: {
        select: {
          id: true,
        },
      },
    },
  },
  stats: {
    select: {
      id: true,
      title: true,
      value: true,
      egos: {
        select: {
          id: true,
        },
      },
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

  if (egostats === null) throw new Error("No egos found");

  return egostats;
}

// export async function createEgo(title: string) {
//   return getUserId((id) => {
//     return prisma.user.update({
//       where: {
//         id,
//       },

//       data: {
//         egos: {
//           create: {
//             title,
//           },
//         },
//       },
//     });
//   });
// }

// export async function linkStatToEgo(statId: string, egoId: string) {
//   return getUserId((id) => {
//     return prisma.user.update({
//       where: {
//         id,
//       },

//       data: {
//         stats: {
//           update: {
//             where: {
//               id: statId,
//             },
//             data: {
//               egos: {
//                 connect: {
//                   id: egoId,
//                 },
//               },
//             },
//           },
//         },
//       },
//     });
//   });
// }
