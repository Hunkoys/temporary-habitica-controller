"use server";

import { getUser } from "@/app/_actions/db";
import { fetchHabitica } from "@/app/_actions/habitica";
import { HabiticaKeys } from "@/app/_types/habitica.types";
import { Habitica } from "@/app/_utils/habitica";
import prisma from "@/prisma/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function saveHabiticaKeys(habaticaKeys: HabiticaKeys): Promise<{
  status: "success" | "invalid" | "error";
}> {
  const id = auth().userId;

  // Prevent spamming and race condition here:

  if (id === null) {
    console.error(`clerk id couldn't be retrieved: ${id}`);
    return { status: "error" };
  }

  const action: "add" | "remove" =
    habaticaKeys.id + habaticaKeys.token === "" ? "remove" : "add";

  if (action === "add") {
    if ((await isAuthorized(habaticaKeys)) === false)
      return { status: "invalid" };

    if ((await addWebhooks(habaticaKeys)) === false) {
      console.error(`addWebhooks failed`);
      return { status: "error" };
    }
  } else if (action === "remove") {
    const user = await getUser();

    if (user === null) {
      console.error(`user not found in database: ${user}`);
      return { status: "error" };
    }

    const { habiticaKeys } = user;

    if (habiticaKeys === "") return { status: "success" }; // webhooks were probably removed already.

    if ((await deleteWebhooks(Habitica.unfoldKeys(habiticaKeys))) === false)
      return { status: "error" };
  }

  // Before we update DB make sure we clean up the webhooks

  await prisma.user.update({
    where: { id },
    data: {
      habiticaKeys: Habitica.foldKeys(habaticaKeys),
    },
  });

  revalidatePath("/", "layout");

  return { status: "success" };
}

async function isAuthorized(habiticaKeys: HabiticaKeys): Promise<boolean> {
  const response = await fetchHabitica<HabiticaResponse>("get", "user", {
    habiticaKeys,
  });

  if (response.success === false) {
    return false;
  }

  return true;
}

async function addWebhooks(habiticaKeys: HabiticaKeys): Promise<boolean> {
  if ((await deleteWebhooks(habiticaKeys)) === false) {
    return false;
  }

  const TYPES: WebhookType[] = [
    "taskActivity",
    "userActivity",
    "questActivity",
  ];
  for (const type of TYPES) {
    const { options }: Webhook = {
      options: {
        created: true,
        deleted: true,
        updated: true,
        scored: true,
        leveledUp: true,
        mountRaised: true,
        petHatched: true,
        questFinished: true,
        questInvited: true,
        questStarted: true,
      },
    };

    const response = await fetchHabitica<Webhook>("post", `user/webhook`, {
      habiticaKeys,
      body: {
        url: DOMAIN,
        type,
        label: WEBHOOKS[type],
        options,
      },
    });

    if (response.success === false) {
      console.error(
        `Error: Habitica api/user/webhook request: ${JSON.stringify(response)}`
      );
      return false;
    }
  }

  return true;
}

async function deleteWebhooks(habiticaKeys: HabiticaKeys): Promise<boolean> {
  const webhooks = await fetchHabitica<Webhook[]>("get", "user/webhook", {
    habiticaKeys,
  });

  if (webhooks.success === false) {
    console.error(
      `Error: Habitica api/user/webhook request: ${JSON.stringify(webhooks)}`
    );
    return false;
  }

  for (const webhook of webhooks.data) {
    if (webhook.label?.startsWith(PREFIX) === false) continue;

    const response = await fetchHabitica<Webhook>(
      "delete",
      `user/webhook/${webhook.id}`,
      {
        habiticaKeys,
      }
    );

    if (response.success === false) {
      console.error(
        `Error: Habitica api/user/webhook request: ${JSON.stringify(response)}`
      );
      return false;
    }
  }
  return true;
}

type HabiticaResponse<T = Object> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

type WebhookType = "taskActivity" | "userActivity" | "questActivity";

type WebhookBase<T extends WebhookType> = {
  type?: T;
  id?: string;
  label?: string;
  url?: string;
  enabled?: boolean;
  failures?: number;
  createdAt?: string;
  updatedAt?: string;
  lastFailureAt?: string;
};

type Webhook =
  | (WebhookBase<"taskActivity"> & {
      options?: {
        created?: boolean;
        updated?: boolean;
        deleted?: boolean;
        scored?: boolean;
      };
    })
  | (WebhookBase<"userActivity"> & {
      options?: {
        petHatched?: boolean;
        mountRaised?: boolean;
        leveledUp?: boolean;
      };
    })
  | (WebhookBase<"questActivity"> & {
      options?: {
        questStarted?: boolean;
        questFinished?: boolean;
        questInvited?: boolean;
      };
    });

const PREFIX = "THC";
const WEBHOOKS: {
  [key in WebhookType]: string;
} = {
  taskActivity: `${PREFIX}-Tasks`,
  userActivity: `${PREFIX}-User`,
  questActivity: `${PREFIX}-Quest`,
} as const;

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
