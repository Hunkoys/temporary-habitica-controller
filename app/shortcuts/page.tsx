import prisma from "@/prisma/db";
import { auth } from "@clerk/nextjs/server";
import { Card } from "@nextui-org/react";

const every12Hours = 1 * 60 * 60 * 12;

function Error({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-2">
      <Card className="p-2 text-center text-danger">{children}</Card>
    </div>
  );
}

export default async function ShortcutsPage() {
  const id = auth().userId;
  if (id === null) return null;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  return <div>{user?.habiticaApiKey}</div>;
}
