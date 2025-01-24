import { getUser } from "@/app/_actions/db";
import EgosClientPage from "@/app/edit/egos/client";
import { auth } from "@clerk/nextjs/server";

export default async function EgosPage() {
  const id = auth().userId;

  if (id === null) {
    console.log(
      "Tried to load a page only accessible when logged in. id from clerk:auth object is null"
    );
    return null;
  }

  const user = await getUser({
    egos: {
      select: {
        id: true,
        title: true,
        stats: { select: { id: true, title: true, value: true } },
      },
    },
  });

  return <EgosClientPage initialEgos={user.egos} />;
}
