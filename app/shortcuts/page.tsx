import { getContent } from '@/app/_utils/habiticaContent';
import { Credentials } from '@/app/_utils/habiticaTypes';
import ShortcutsList from '@/app/shortcuts/list';
import prisma from '@/prisma/db';
import { currentUser } from '@clerk/nextjs/server';
import { Card } from '@nextui-org/react';

const every12Hours = 1 * 60 * 60 * 12;
const content = getContent(every12Hours);

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

  if (!user.linked)
    return (
      <div>
        <Card className="p-2">Please link your Habitica account to use shortcuts</Card>
      </div>
    );

  if (user.habiticaApiKey === null || user.habiticaUserId === null) return <div>Missing Habitica credentials</div>;

  const credentials: Credentials = { habId: user.habiticaUserId, apiKey: user.habiticaApiKey };
  return <ShortcutsList credentials={credentials} content={content} shortcuts={user.shortcuts} />;
}

// Turn into server component to pre render shortcuts, they don't change often
