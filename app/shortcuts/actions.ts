"use server";

import { getUser } from "@/app/_actions/db";
import { fetchHabitica } from "@/app/_actions/habitica";
import { Stats } from "@/app/_utils/habiticaTypes";
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

export async function castBurstOfFlames(burstCount: string): Promise<{
  success: boolean;
  message: string;
}> {
  const mana = await fetchHabitica<{ stats: { mp: number } }>(
    "get",
    "user?userFields=stats.mp"
  );

  if (mana.success === false) {
    return { success: false, message: mana.error };
  }

  const BURST_OF_FLAMES_COST = 10;

  const count = Number(burstCount);
  if (count < 1 || Number.isNaN(count)) {
    return { success: false, message: "" };
  }

  if (count > Math.floor(mana.data.stats.mp / BURST_OF_FLAMES_COST)) {
    return { success: true, message: "Not enough mana" };
  }

  const tasks = await fetchHabitica<
    Array<{ id: string; type: string; value: number }>
  >("get", "tasks/user");

  if (tasks.success === false) {
    return { success: true, message: "You don't have any tasks" };
  }

  const maxValueTask = tasks.data.reduce(
    (max, thisTask) => {
      if (thisTask.type === "reward") return max;
      return thisTask.value > max.value ? thisTask : max;
    },
    { value: 0, id: "", type: "" }
  );

  if (maxValueTask.id === "") {
    return { success: true, message: "You don't have any tasks" };
  }

  for (let i = 0; i < count; i++) {
    const cast = await fetchHabitica(
      "post",
      `user/class/cast/fireball?targetId=${maxValueTask.id}`
    );

    if (cast.success === false) {
      return { success: false, message: cast.error };
    }
  }

  if ((await saveBurstCount(burstCount)) === false) {
    console.error("Failed to save burst count");
  }

  return { success: true, message: JSON.stringify(maxValueTask) };
}

export async function saveBurstCount(burstCount: string): Promise<boolean> {
  const id = auth().userId;

  if (id === null) {
    console.error(`clerk id couldn't be retrieved: ${id}`);
    return false;
  }

  const user = await getUser({ shortcuts: true });
  if (user === null) {
    console.error(`user not found in database: ${user}`);
    return false;
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

    return true;
  }

  await prisma.shortcut.update({
    where: { id: burstCountShortcuts.id },
    data: { command: burstCount },
  });

  return true;
}
