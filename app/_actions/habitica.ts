"use server";

import { HabiticaContent, HabiticaKeys } from "@/app/_types/habitica.types";
import { getUser } from "@/app/_actions/db";
import { Habitica } from "@/app/_utils/habitica";

const X_CLIENT = process.env.HABITICA_X_CLIENT;

type HabiticaResponse<T = Object> =
  | {
      success: true;
      data: T;
      [key: string]: unknown;
    }
  | {
      success: false;
      error: string;
      [key: string]: unknown;
    };

export async function fetchHabitica<T = unknown>(
  method: "post" | "get" | "put" | "delete",
  endpoint: string,
  options: {
    body?: unknown;
    cache?: number;
    anon?: boolean;
    habiticaKeys?: HabiticaKeys;
  } = {}
): Promise<HabiticaResponse<T>> {
  let habiticaKeys: HabiticaKeys = {
    id: "",
    token: "",
  };

  if (Boolean(options.anon) === false) {
    if (options.habiticaKeys) {
      habiticaKeys = options.habiticaKeys;
    } else {
      const user = await getUser();

      if (user === null) {
        return {
          success: false,
          error: "UserNotFound",
          message: "User not found in database",
          from: "temporary habitica controller",
        };
      }

      if (user.habiticaKeys === "") {
        return {
          success: false,
          error: "HabiticaCredentialsNotSet",
          message: "Habitica credentials not set in database",
          from: "temporary habitica controller",
        };
      }

      habiticaKeys = Habitica.unfoldKeys(user.habiticaKeys);
    }
  }

  const response = await fetch(`https://habitica.com/api/v3/${endpoint}`, {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
      "x-client": X_CLIENT || "",
      "x-api-user": habiticaKeys.id,
      "x-api-key": habiticaKeys.token,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    next: {
      revalidate: options.cache,
    },
  });

  const json = await response.json();

  if (json.success === false)
    console.error(
      `habiticaFetch Error: \nResponse and Creds Log: ${JSON.stringify({
        ...json,
        ...habiticaKeys,
      })}`
    );

  return json;
}

let content: HabiticaContent = {};
let dataTimeStamp: number = Date.now();
const validity = 2 * 60 * 60 * 1000;

export async function getContent() {
  if (dataTimeStamp + validity < Date.now()) {
    const json = await fetchHabitica<HabiticaContent>("get", "content"); // Try ZOD
    if (json.success === true) {
      dataTimeStamp = Date.now();
      content = json.data;
    }
  }

  return content;
}
