import { getUser } from "@/app/_actions/db";
import { Habitica } from "@/app/_utils/habiticaKeys";
import HabiticaForm from "@/app/settings/_components/HabiticaForm";
import { auth } from "@clerk/nextjs/server";
import { Card, CardBody, Skeleton } from "@nextui-org/react";
import { Suspense } from "react";

export default async function SettingsPage() {
  const id = auth().userId;
  if (id === null) {
    console.log(
      "Tried to load a page only accessible when logged in. id from clerk:auth object is null"
    );
    return null;
  }

  const user = await getUser();
  if (user === null) throw new Error("User not found in the database.");

  const habiticaKeys = Habitica.unfoldKeys(user.habiticaKeys);

  return (
    <div className="w-full h-full overflow-auto p-2 flex justify-center items-start">
      <Card className="w-full sm:w-[640px]">
        <CardBody className="flex flex-col gap-2 items-stretch">
          <Suspense
            fallback={
              <Skeleton className="h-[1em] w-3/5 rounded-lg"></Skeleton>
            }
          >
            <HabiticaForm habiticaKeys={habiticaKeys} />
          </Suspense>
        </CardBody>
      </Card>
    </div>
  );
}
