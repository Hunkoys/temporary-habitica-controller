import prisma from '@/prisma/db';

export async function createUser(email: string) {
  const user = await prisma.user.create({
    data: {
      email,
    },
  });
}
