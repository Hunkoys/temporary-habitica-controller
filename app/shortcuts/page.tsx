import { fetchHabitica, getContent } from "@/app/_actions/habitica";
import prisma from "@/prisma/db";
import { auth } from "@clerk/nextjs/server";
import { Card } from "@nextui-org/react";

const every12Hours = 1 * 60 * 60 * 12;

function ErrorElement({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-2">
      <Card className="p-2 text-center text-danger">{children}</Card>
    </div>
  );
}

export default async function ShortcutsPage() {
  const id = auth().userId;
  if (id === null)
    throw new Error(
      "Tried to load a page only accessible when logged in. id from clerk:auth object is null"
    );

  return <div>{}</div>;
}
