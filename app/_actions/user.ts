"use server";

import { fetchHabitica } from "@/app/_actions/habitica";
import prisma from "@/prisma/db";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

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

const DOMAIN = process.env.DOMAIN;

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

type HabiticaAPI = {
  id: string;
  token: string;
};

async function isAuthorized(habaticaAPI: HabiticaAPI): Promise<boolean> {
  const response = await fetchHabitica<HabiticaResponse>("get", "user", {
    creds: {
      habiticaApiUser: habaticaAPI.id,
      habiticaApiKey: habaticaAPI.token,
    },
  });

  if (response.success === false) {
    return false;
  }

  return true;
}

async function addWebhooks(habaticaAPI: HabiticaAPI): Promise<boolean> {
  if ((await deleteWebhooks(habaticaAPI)) === false) {
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
      creds: {
        habiticaApiUser: habaticaAPI.id,
        habiticaApiKey: habaticaAPI.token,
      },
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

async function deleteWebhooks(habiticaAPI: HabiticaAPI): Promise<boolean> {
  const webhooks = await fetchHabitica<Webhook[]>("get", "user/webhook", {
    creds: {
      habiticaApiKey: habiticaAPI.token,
      habiticaApiUser: habiticaAPI.id,
    },
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
        creds: {
          habiticaApiKey: habiticaAPI.token,
          habiticaApiUser: habiticaAPI.id,
        },
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

export async function saveHabiticaCreds(habaticaAPI: {
  id: string;
  token: string;
}): Promise<{
  status: "success" | "invalid" | "error";
}> {
  const id = auth().userId;

  // Prevent spamming and race condition here:

  if (id === null) {
    console.error(`clerk id couldn't be retrieved: ${id}`);
    return { status: "error" };
  }

  const action: "add" | "remove" =
    habaticaAPI.id + habaticaAPI.token === "" ? "remove" : "add";

  if (action === "add") {
    if ((await isAuthorized(habaticaAPI)) === false)
      return { status: "invalid" };

    if ((await addWebhooks(habaticaAPI)) === false) {
      console.error(`addWebhooks failed`);
      return { status: "error" };
    }
  } else if (action === "remove") {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (user === null) {
      console.error(`user not found in database: ${user}`);
      return { status: "error" };
    }

    if (!user.habiticaApiUser || !user.habiticaApiKey)
      return { status: "success" }; // webhooks were probably removed already.

    if (
      (await deleteWebhooks({
        id: user.habiticaApiUser,
        token: user.habiticaApiKey,
      })) === false
    )
      return { status: "error" };
  }

  // Before we update DB make sure we clean up the webhooks

  await prisma.user.update({
    where: { id },
    data: {
      habiticaApiUser: habaticaAPI.id,
      habiticaApiKey: habaticaAPI.token,
    },
  });

  revalidatePath("/", "layout");

  return { status: "success" };
}
