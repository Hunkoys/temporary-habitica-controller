import fs from "fs/promises";
import path from "path";

import { habFetch } from "@/app/_UTILS/habitica";
import prisma from "@/prisma/db";
import { NextRequest } from "next/server";

// Example POST payload:
// {
//   "type": "leveledUp",
//   "initialLvl": 34,
//   "finalLvl": 35,
//   "webhookType": "userActivity",
//   "user": {
//     "_id": "7f023f3e-858b-46f5-963c-b5f327512626"
//   }
// }

const location = path.join(
  process.cwd(),
  "/app/api/webhooks/level/webhook.json"
);
// export async function POST(request: NextRequest) {
//   const payload = await request.json();

//   const user = await prisma.user.findFirst({
//     where: { habiticaUserId: payload.user._id },
//     include: {
//       shortcuts: {
//         where: {
//           title: "Auto assign stat points",
//         },
//       },
//     },
//   });

//   if (!user || user.habiticaApiKey === null || user.habiticaUserId === null) {
//     return new Response("success", { status: 200 });
//   }

//   const creds = {
//     habId: user.habiticaUserId,
//     apiKey: user.habiticaApiKey,
//   };

//   if (user.shortcuts.length > 0) {
//     const shortcut = user.shortcuts[0];
//     const command = shortcut.command as { stat: string; status: boolean };

//     if (command.status) {
//       const userResponse = await habFetch("get", "user", creds, null, {
//         revalidate: 0,
//       });
//       const userBody = await userResponse.json();
//       const amount = userBody.data.stats.points;

//       const allocatResponse = await habFetch(
//         "post",
//         "user/allocate-bulk",
//         creds,
//         {
//           stats: {
//             [command.stat]: amount,
//           },
//         }
//       );
//       const body = await allocatResponse.json();
//     }
//   }

//   return new Response("success", { status: 200 });
// }

export async function GET(request: NextRequest) {
  // const payload = await request.json();
  // save to file system

  fs.appendFile(location, "\nget:\n");
  // fs.appendFile(location, JSON.stringify(payload, null, 2));
  return new Response("Success", { status: 200 });
}

export async function PUT(request: NextRequest) {
  const payload = await request.json();
  // save to file system

  fs.appendFile(location, "\nput:\n");
  fs.appendFile(location, JSON.stringify(payload, null, 2));
  return new Response("Success", { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const payload = await request.json();
  // save to file system

  fs.appendFile(location, "\ndelete:\n");
  fs.appendFile(location, JSON.stringify(payload, null, 2));
  return new Response("Success", { status: 200 });
}

export async function PATCH(request: NextRequest) {
  const payload = await request.json();
  // save to file system

  fs.appendFile(location, "\nPatch:\n");
  fs.appendFile(location, JSON.stringify(payload, null, 2));
  return new Response("Success", { status: 200 });
}
