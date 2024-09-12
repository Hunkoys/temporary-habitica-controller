import HabiticaForm from '@/app/settings/HabiticaForm';
import prisma from '@/prisma/db';
import { currentUser } from '@clerk/nextjs/server';
import { Card, CardBody, CardHeader, Divider, Skeleton } from '@nextui-org/react';
import { Suspense } from 'react';

export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) return <div>Not logged in</div>;

  const habitica = await prisma.user.findUnique({
    where: { id: user.id },
    select: { habiticaApiKey: true, habiticaUserId: true, id: true },
  });
  if (!habitica) return <div>User not found</div>;

  let { habiticaApiKey: apiKey, habiticaUserId: habId } = habitica;
  apiKey ??= '';
  habId ??= '';

  return (
    <div className="w-full h-full overflow-auto p-2 flex justify-center items-start">
      <Card className="w-full sm:w-[640px]">
        <CardHeader>
          <h1>Settings</h1>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-2 items-stretch">
          <Suspense fallback={<Skeleton className="h-[1em] w-3/5 rounded-lg"></Skeleton>}>
            <HabiticaForm habId={habId} apiKey={apiKey} id={user.id} />
          </Suspense>
        </CardBody>
      </Card>
    </div>
  );
}
