import listIcon from '@/assets/list-icon.png';

import CommonButton from '@/app/_components/CommonButton';
import { currentUser } from '@clerk/nextjs/server';
import { Card, CardBody, CardFooter } from '@nextui-org/react';
import Image from 'next/image';
import prisma from '@/prisma/db';
import { Prisma } from '@prisma/client';
import Link from 'next/link';
import ShortcutsList from '@/app/shortcuts/list';

async function equipMax(stat: 'str' | 'int' | 'per' | 'con') {
  // return await fetch(`https://habitica.com/api/v4/user/unequip/equipped`);
}

export default async function ShortcutsPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) return <div>Not signed in</div>;

  const user = await prisma.user.findUnique({
    where: { id: clerkUser.id },
    select: { id: true, habiticaUserId: true, habiticaApiKey: true, shortcuts: true, linked: true },
  });

  if (!user)
    return (
      <div>
        <Card className="p-2">User not found</Card>
      </div>
    );

  console.log(user);

  if (!user.linked)
    return (
      <div>
        <Card className="p-2">Please link your Habitica account to use shortcuts</Card>
      </div>
    );

  return <ShortcutsList user={user} />;
}

// Turn into server component to pre render shortcuts, they don't change often
