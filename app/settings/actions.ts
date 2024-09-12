'use server';

import prisma from '@/prisma/db';

export async function saveKeysToDb(id: string, { habId, key }: { habId: string; key: string }) {
  return await prisma.user.update({ data: { habiticaUserId: habId, habiticaApiKey: key }, where: { id } });
}
