import { auth } from "@clerk/nextjs/server";

class AuthError extends Error {}

export async function getUserId<T extends unknown>(
  callback: (id: string) => T
) {
  const id = auth().userId;
  if (id == null) {
    const msg = "Can't do action because user is not logged in";
    console.error(msg);
    throw new AuthError(msg);
  }

  return callback(id);
}
