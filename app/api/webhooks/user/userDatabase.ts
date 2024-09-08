import prisma from '@/prisma/db';

export async function createUser(id: string) {
  const user = await prisma.user.create({
    data: {
      id,
    },
  });
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}

// TODO: add return signal
