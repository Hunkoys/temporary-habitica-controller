"use server";

import prisma from "@/prisma/db";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

class UnauthorizedError extends Error {}

export async function getUser<T extends Prisma.UserInclude>(include?: T) {
  const id = auth().userId;
  if (id === null) {
    throw new UnauthorizedError(
      "Tried to load a page only accessible when logged in. id from clerk:auth object is null"
    );
  }

  const search: Prisma.UserFindUniqueArgs = {
    where: { id },
  };

  if (include) search.include = include;

  return await prisma.user.findUnique(search);
}
