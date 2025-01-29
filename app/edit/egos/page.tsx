import { getEgostats } from "@/app/edit/egos/actions";
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

  const user = (await getEgostats()) || { egos: [], stats: [] };

  return (
    <div className="h-full">
      <EgosClientPage userInitial={user} />
    </div>
  );
}
