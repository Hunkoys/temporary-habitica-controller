"use server";

import { HabiticaContent, HabiticaCreds } from "@/app/_types/habitica.types";
import prisma from "@/prisma/db";
import { auth } from "@clerk/nextjs/server";

export async function fetchHabitica<T extends unknown>(
  method: "post" | "get" | "put" | "delete",
  endpoint: string,
  options: {
    body?: unknown;
    cache?: number;
    anon?: boolean;
    creds?: HabiticaCreds;
  } = {}
): Promise<T> {
  const creds: HabiticaCreds = {
    habiticaApiUser: "",
    habiticaApiKey: "",
  };

  if (Boolean(options.anon) === false) {
    if (options.creds) {
      creds.habiticaApiUser = options.creds.habiticaApiUser;
      creds.habiticaApiKey = options.creds.habiticaApiKey;
    } else {
      const id = auth().userId;
      if (id === null)
        return {
          success: false,
          error: "ClerkIdNotFound",
          message: "auth().userId might be null",
          from: "temporary habitica controller",
        } as T;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          habiticaApiUser: true,
          habiticaApiKey: true,
        },
      });

      if (user === null)
        return {
          success: false,
          error: "UserNotFound",
          message: "User not found in database",
          from: "temporary habitica controller",
        } as T;

      const habiticaApiUser = user.habiticaApiUser;
      const habiticaApiKey = user.habiticaApiKey;

      if (habiticaApiUser === null || habiticaApiKey === null)
        return {
          success: false,
          error: "HabiticaCredentialsNotSet",
          message: "Habitica credentials not set in database",
          from: "temporary habitica controller",
        } as T;

      creds.habiticaApiUser = habiticaApiUser;
      creds.habiticaApiKey = habiticaApiKey;
    }
  }

  console.log(creds.habiticaApiKey);
  const response = await fetch(`https://habitica.com/api/v3/${endpoint}`, {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
      "x-api-user": creds.habiticaApiUser,
      "x-api-key": creds.habiticaApiKey,
    },
    next: {
      revalidate: options.cache,
    },
  });

  const json = await response.json();

  if (json.success === false)
    console.error(
      `habiticaFetch Error: \nResponse and Creds Log: ${JSON.stringify({
        ...json,
        ...creds,
      })}`
    );

  return json;
}

let content: HabiticaContent = {};
let dataTimeStamp: number = Date.now();
const validity = 2 * 60 * 60 * 1000;

export async function getContent() {
  if (dataTimeStamp + validity < Date.now()) {
    const json = await fetchHabitica<{ success: boolean; data: Object }>( // Try ZOD
      "get",
      "content"
    );
    if (json.success === true) {
      dataTimeStamp = Date.now();
      content = json.data;
    }
  }

  return content;
}
