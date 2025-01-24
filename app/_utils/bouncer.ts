import { auth } from "@clerk/nextjs/server";

export async function ifLoggedIn<T extends (id: string) => unknown>(
  callback: T
) {
  const id = auth().userId;
  if (id === null) {
    console.log("Can't do action because user is not logged in");
    return null;
  }

  return callback(id);
}
