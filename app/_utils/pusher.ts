"server-only";

import Pusher from "pusher";

const PUSHER_ID = process.env.PUSHER_ID;
const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY;
const PUSHER_SECRET = process.env.PUSHER_SECRET;
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

const pusher =
  !PUSHER_ID || !PUSHER_KEY || !PUSHER_SECRET || !PUSHER_CLUSTER
    ? null
    : new Pusher({
        appId: PUSHER_ID,
        key: PUSHER_KEY,
        secret: PUSHER_SECRET,
        cluster: PUSHER_CLUSTER,
      });

export default function getPusher(): Pusher {
  if (pusher == null)
    throw new Error("Pusher could not be initialized. Check env keys.");

  return pusher;
}
