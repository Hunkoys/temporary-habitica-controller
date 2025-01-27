import { auth } from "@clerk/nextjs/server";

export function getUserId() {
  const user = auth();
  if (user.userId === null) {
    throw new Error("User not authenticated");
  }

  return user.userId;
}
