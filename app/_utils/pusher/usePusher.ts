"use client";

import Pusher from "pusher-js";
import { useEffect } from "react";

const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY;
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

export default function usePusher(
  channel: string,
  callback: (
    on: <T extends string, O extends Object>(
      event: T,
      cb: (data: O) => void
    ) => void
  ) => void
) {
  useEffect(() => {
    let pusher: Pusher;
    try {
      if (!PUSHER_KEY || !PUSHER_CLUSTER) {
        throw new Error("PUSHER_KEY or PUSHER_CLUSTER might be undefined");
      }

      pusher = new Pusher(PUSHER_KEY, {
        cluster: PUSHER_CLUSTER,
      });

      const c = pusher.subscribe(channel);
      callback(c.bind.bind(c));
    } catch (err) {
      console.log();
    }

    return () => {
      pusher.connection.bind("connected", () => {
        console.log("disconnected");
        pusher.disconnect();
      });
    };
  });
}
