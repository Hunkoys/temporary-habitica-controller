import { getUser } from "@/app/_actionso/db";
import { Habitica } from "@/app/_utilso/habitica";
import HabiticaForm from "@/app/settings/_componentso/HabiticaForm";
import { auth } from "@clerk/nextjs/server";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Skeleton,
} from "@nextui-org/react";
import { Suspense } from "react";

export default async function SettingsPage() {
  const id = auth().userId;
  if (id === null)
    throw new Error(
      "Tried to load a page only accessible when logged in. id from clerk:auth object is null"
    );

  const user = await getUser();
  if (user === null) throw new Error("User not found in the database.");

  const habiticaKeys = Habitica.unfoldKeys(user.habiticaKeys);

  return (
    <div className="w-full h-full overflow-auto p-2 flex justify-center items-start">
      <Card className="w-full sm:w-[640px]">
        <CardHeader>
          <h1>Settings</h1>
        </CardHeader>
        <Divider />
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
