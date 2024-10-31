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
    console.error(`Error: Habitica api/user request: ${response}`);
    return false;
  }

  return true;
}

async function manageWebhooks(
  action: "add" | "remove",
  habiticaAPI: HabiticaAPI
): Promise<boolean> {
  const user = await getUser();
  if (user === null) {
    console.error(`Error: User not found in the database.`);
    return false;
  }

  const api: HabiticaAPI = habiticaAPI;

  if (action === "remove") {
    if (!user.habiticaApiKey || !user.habiticaApiUser) return true;

    api.id = user.habiticaApiUser;
    api.token = user.habiticaApiKey;
  }

  const allWebhooks = await fetchHabitica<HabiticaResponse<Webhook[]>>(
    "get",
    "user/webhook",
    {
      creds: {
        habiticaApiKey: api.token,
        habiticaApiUser: api.id,
      },
    }
  );
  if (allWebhooks.success === false) return false;

  const ourWebhooks = allWebhooks.data.filter((webhook) =>
    (webhook.label || "").startsWith(PREFIX)
  );

  for (const webhook of ourWebhooks) {
    const response = await fetchHabitica<HabiticaResponse<Webhook>>(
      "delete",
      `user/webhook/${webhook.id}`
    );
    if (response.success === false)
      if (response.error !== "NotFound") return false;
  }

  if (action === "add") {
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

      const response = await fetchHabitica<HabiticaResponse<Webhook>>(
        "post",
        `user/webhook`,
        {
          creds: {
            habiticaApiUser: habiticaAPI.id,
            habiticaApiKey: habiticaAPI.token,
          },
          body: {
            url: DOMAIN,
            type,
            label: WEBHOOKS[type],
            options,
          },
        }
      );

      if (response.success === false) {
        console.error(`Error: Habitica api/user/webhook request: ${response}`);
        return false;
      }
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

  if (id === null) {
    console.error(`clerk id couldn't be retrieved: ${id}`);
    return { status: "error" } as const;
  }

  const action: Parameters<typeof manageWebhooks>[0] =
    habaticaAPI.id + habaticaAPI.token === "" ? "remove" : "add";

  if (action === "add" && (await isAuthorized(habaticaAPI)) === false) {
    return { status: "invalid" } as const;
  }

  // Before we update DB make sure we clean up the webhooks
  if ((await manageWebhooks(action, habaticaAPI)) === false)
    return { status: "error" } as const;

  await prisma.user.update({
    where: { id },
    data: {
      habiticaApiUser: habaticaAPI.id,
      habiticaApiKey: habaticaAPI.token,
    },
  });

  revalidatePath("/", "layout");

  return { status: "success" } as const;
}

// {

//   if (
//     habiticaCreds.habiticaApiKey === "" &&
//     habiticaCreds.habiticaApiUser === ""
//   ) {
//     const existingWebhooks = await fetchHabitica<HabiticaResponse<Webhook[]>>(
//       "get",
//       "user/webhook"
//     );
//     if (existingWebhooks.success === false) {
//       console.error(
//         `Error: Habitica api/user/webhook request: ${JSON.stringify(
//           existingWebhooks
//         )}`
//       );
//       return { status: "error" };
//     }

//     await prisma.user.update({
//       where: { id },
//       data: habiticaCreds,
//     });
//     // Remove webhook

//     revalidatePath("/", "layout");

//     return { status: "success" };
//   }

//   const response = await fetchHabitica<{ success: boolean; error: string }>(
//     "get",
//     "user",
//     { creds: habiticaCreds }
//   );

//   if (response.success === false) {
//     if (response.error === "NotAuthorized") return { status: "invalid" };

//     console.error(`Error: Habitica api/user request: ${response}`);
//     return { status: "error" };
//   }

//   await prisma.user.update({
//     where: { id },
//     data: habiticaCreds,
//   });
//   // add webhook

//   revalidatePath("/", "layout");

//   return {
//     status: "success",
//   };
// }
