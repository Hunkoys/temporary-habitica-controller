'use server';

import prisma from '@/prisma/db';
import { NextRequest } from 'next/server';

export async function GET() {
  const data = await prisma.dog.findMany();

  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  console.error(payload);
  if (!payload) return new Response('no payload', { status: 202 });

  try {
    const a = await prisma.dog.create({
      data: {
        data: payload,
      },
    });
    console.error(a);
  } catch (Err) {
    console.error(Err);
    return new Response('db error', { status: 201 });
  }

  return new Response('success', { status: 200 });
}
