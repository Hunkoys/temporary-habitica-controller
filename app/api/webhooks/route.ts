'use server';

import prisma from '@/prisma/db';
import { NextRequest } from 'next/server';

export async function GET() {
  const data = await prisma.shortcut.findFirst({
    where: {
      title: 'webhook data',
    },
  });
  console.log(data);

  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  console.error(payload);
  if (!payload) return new Response('no payload', { status: 202 });

  try {
    const a = await prisma.shortcut.create({
      data: {
        title: 'webhook data',
        command: [payload.data],
        userId: payload.user._id,
      },
    });
    console.log(a);
  } catch (Err) {
    console.log(Err);
    return new Response('db error', { status: 200 });
  }

  return new Response('success', { status: 200 });
}
