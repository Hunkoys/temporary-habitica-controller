"use server";

import { HabiticaContent, HabiticaCreds } from "@/app/_types/habitica.types";
import prisma from "@/prisma/db";
import { auth } from "@clerk/nextjs/server";

export async function fetchHabitica(
  method: "post" | "get" | "put" | "delete",
  endpoint: string,
  options: { body?: unknown; cache?: number; anon?: boolean } = {
    cache: 0,
    anon: false,
  }
) {
  const creds: HabiticaCreds = {
    habiticaApiKey: "",
    habiticaApiUser: "",
  };

  if (options.anon === false) {
    const id = auth().userId;
    if (id === null)
      return {
        success: false,
        error: "ClerkIdNotFound",
        message: "auth().userId might be null",
        from: "temporary habitica controller",
      };

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
      };

    const habiticaApiUser = user.habiticaApiUser;
    const habiticaApiKey = user.habiticaApiKey;

    if (habiticaApiUser === null || habiticaApiKey === null)
      return {
        success: false,
        error: "HabiticaCredentialsNotSet",
        message: "Habitica credentials not set in database",
        from: "temporary habitica controller",
      };

    creds.habiticaApiUser = habiticaApiUser;
    creds.habiticaApiKey = habiticaApiKey;
  }

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
    const json = await fetchHabitica("get", "content");
    if (json.success === true) {
      dataTimeStamp = Date.now();
      content = json.data;
    }
  }

  return content;
}
