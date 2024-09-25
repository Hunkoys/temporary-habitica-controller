import prisma from '@/prisma/db';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const payload = await req.json();
  // await prisma.shortcut.create({});

  return new Response('success', { status: 200 });
}
