import { Content } from '@/app/_utils/habitica';
import ShortcutsList from '@/app/shortcuts/list';
import prisma from '@/prisma/db';
import { currentUser } from '@clerk/nextjs/server';
import { Card } from '@nextui-org/react';

// const content = (await (await habFetch('get', 'content')).json()) as Content;
const content = {} as Content;

// save to file

// import fs from 'fs';
// import path from 'path';

// const filePath = path.join(process.cwd(), 'content.json');
// fs.writeFileSync(filePath, JSON.stringify(content.gear.flat, null, 2), 'utf-8');

// console.log(content.data.gear.flat);

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

  return <ShortcutsList user={user} content={content} />;
}

// Turn into server component to pre render shortcuts, they don't change often
