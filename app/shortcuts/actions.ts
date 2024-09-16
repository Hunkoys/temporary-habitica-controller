'use server';

import { Stats } from '@/app/_utils/habiticaTypes';
import prisma from '@/prisma/db';

export async function saveAutoAssignCommand(userId: string, command: { stat: keyof Stats; status: boolean }) {
  const id = 'auto-assign-stat-' + userId;
  const shortcut = await prisma.shortcut.upsert({
    where: { id },
    update: { command },
    create: { id, title: 'Auto assign stat points', command, userId },
  });
  console.log(shortcut);
  return shortcut;
}

export async function getAutoAssignCommand(userId: string) {
  const id = 'auto-assign-stat-' + userId;
  return prisma.shortcut.findUnique({ where: { id } });
}
