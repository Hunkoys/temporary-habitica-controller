"use server";

import { habFetch } from "@/app/_utils/habitica";
import prisma from "@/prisma/db";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getUser<T extends Prisma.UserInclude>(include?: T) {
  const id: string | null = auth().userId;
  if (id === null) return null;

  const user = await prisma.user.findUnique({
    where: { id },
    include,
  });
  if (user === null) return null;

  return user;
}

type SaveHabiticaKeysReturnType = {
  status: "success" | "invalid" | "error";
};

export async function saveHabiticaKeys(
  habiticaCreds: HabiticaCreds
): Promise<SaveHabiticaKeysReturnType> {
  const id = auth().userId;
  if (id === null) {
    console.error(`clerk id couldn't be retrieved: ${id}`);
    return { status: "error" } as const;
  }

  if (
    habiticaCreds.habiticaApiKey === "" &&
    habiticaCreds.habiticaApiUser === ""
  ) {
    await prisma.user.update({
      where: { id },
      data: habiticaCreds,
    });
    revalidatePath("/", "layout");

    return { status: "success" };
  }

  const response = await habFetch("get", "user", {
    habId: habiticaCreds.habiticaApiUser,
    apiKey: habiticaCreds.habiticaApiKey,
  });

  switch (response.status) {
    case 200:
      break;
    case 401:
      return { status: "invalid" };
    default:
      console.error(`Error: Habitica api/user request: ${response}`);
      return { status: "error" };
  }

  await prisma.user.update({
    where: { id },
    data: habiticaCreds,
  });
  revalidatePath("/", "layout");

  return {
    status: "success",
  };
}
