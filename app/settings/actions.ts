'use server';

import prisma from '@/prisma/db';

export async function saveKeysToDb(
  id: string,
  { habId, key, linked }: { habId: string; key: string; linked: boolean }
) {
  return await prisma.user.update({ data: { habiticaUserId: habId, habiticaApiKey: key, linked }, where: { id } });
}
