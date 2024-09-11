import listIcon from '@/assets/list-icon.png';

import CommonButton from '@/app/_components/CommonButton';
import { currentUser } from '@clerk/nextjs/server';
import { Card, CardBody, CardFooter } from '@nextui-org/react';
import Image from 'next/image';
import prisma from '@/prisma/db';
import { Prisma } from '@prisma/client';
import Link from 'next/link';

async function equipMax(stat: 'str' | 'int' | 'per' | 'con') {
  // return await fetch(`https://habitica.com/api/v4/user/unequip/equipped`);
}

export default async function ShortcutsPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) return <div>Not signed in</div>;

  const user = await prisma.user.findUnique({ where: { id: clerkUser.id }, include: { shortcuts: true } });
  if (!user)
    return (
      <div>
        <Card className="p-2">
          <p>Habitica Key not set yet</p>
          <p>
            Go to{' '}
            <CommonButton as={Link} href="/settings">
              Settings
            </CommonButton>{' '}
            to link your Habitica
          </p>
        </Card>
      </div>
    );

  return (
    <div className="p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 overflow-auto h-full w-full max-w-[1200px]">
      <Card className="h-36">
        <CardBody>
          <Image src={listIcon} alt="List Icon" width={50} height={50} />
        </CardBody>
        <CardFooter>
          <CommonButton className="w-full">Equip Max Strength</CommonButton>
        </CardFooter>
      </Card>
    </div>
  );
}

// Turn into server component to pre render shortcuts, they don't change often
