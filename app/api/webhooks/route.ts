import prisma from '@/prisma/db';
import { NextRequest } from 'next/server';

const dbID = '26ea2b6d-ae87-4b2c-89c0-6423b0969f9e';

export async function POST(req: NextRequest) {
  const payload = await req.json();
  if (!payload) return new Response('no payload', { status: 200 });

  try {
    await prisma.shortcut.create({
      data: {
        title: 'webhook data',
        command: [payload.data],
        userId: payload.user._id,
      },
    });
  } catch (Err) {
    return new Response('db error', { status: 200 });
  }

  return new Response('success', { status: 200 });
}
