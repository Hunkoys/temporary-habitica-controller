"use server";

import { getUser } from "@/app/_ACTIONS/db";
import { Stats } from "@/app/_UTILS/habiticaTypes";
import prisma from "@/prisma/db";
import { auth } from "@clerk/nextjs/server";

export async function saveAutoAssignCommand(
  userId: string,
  command: { stat: keyof Stats; status: boolean }
) {
  const id = "auto-assign-stat-" + userId;
  const shortcut = await prisma.shortcut.upsert({
    where: { id },
    update: { command },
    create: { id, title: "Auto assign stat points", command, userId },
  });
  console.log(shortcut);
  return shortcut;
}

export async function getAutoAssignCommand(userId: string) {
  const id = "auto-assign-stat-" + userId;
  return prisma.shortcut.findUnique({ where: { id } });
}

export async function saveBurstCount(burstCount: string) {
  const id = auth().userId;

  if (id === null) {
    console.error(`clerk id couldn't be retrieved: ${id}`);
    return { status: "error" };
  }

  const user = await getUser({ shortcuts: true });
  if (user === null) {
    console.error(`user not found in database: ${user}`);
    return { status: "error" };
  }

  const burstCountShortcuts = user.shortcuts.find(
    (s) => s.title === "burstCount"
  );

  if (burstCountShortcuts === undefined) {
    await prisma.user.update({
      where: { id },
      data: {
        shortcuts: {
          create: { title: "burstCount", command: burstCount },
        },
      },
    });

    return;
  }

  await prisma.shortcut.update({
    where: { id: burstCountShortcuts.id },
    data: { command: burstCount },
  });
}
