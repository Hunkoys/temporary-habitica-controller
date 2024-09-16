import { getContent } from '@/app/_utils/habiticaContent';
import { Credentials } from '@/app/_utils/habiticaTypes';
import ShortcutsList from '@/app/shortcuts/list';
import prisma from '@/prisma/db';
import { currentUser } from '@clerk/nextjs/server';
import { Card } from '@nextui-org/react';

const every12Hours = 1 * 60 * 60 * 12;

function Error({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-2">
      <Card className="p-2 text-center">{children}</Card>
    </div>
  );
}

export default async function ShortcutsPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) return <Error>Not logged in</Error>;

  const user = await prisma.user.findUnique({
    where: { id: clerkUser.id },
    select: { id: true, habiticaUserId: true, habiticaApiKey: true, shortcuts: true, linked: true },
  });

  if (!user) return <Error>User not found</Error>;
  if (!user.linked) return <Error>Please link your Habitica account to use shortcuts</Error>;

  if (user.habiticaApiKey === null || user.habiticaUserId === null) return <Error>Missing Habitica credentials</Error>;

  const credentials: Credentials = { habId: user.habiticaUserId, apiKey: user.habiticaApiKey };

  const content = await getContent(every12Hours);

  if (!content) return <Error>Failed to get content</Error>;

  return <ShortcutsList credentials={credentials} content={content} shortcuts={user.shortcuts} id={user.id} />;
}
