import { getUser } from "@/app/_actions/db";
import { HabiticaKeys, QuestGameState } from "@/app/_types/habitica.types";
import { Habitica } from "@/app/_utils/habiticaKeys";
import QuestScreen from "@/app/quest/_components/QuestScreen";
import { Card, Link } from "@nextui-org/react";
import NextLink from "next/link";

export default async function QuestPage() {
  const user = await getUser({ shortcuts: true });
  if (user === null)
    return <ErrorElement>User not found in the database.</ErrorElement>;
  if (user.habiticaKeys === "")
    return (
      <ErrorElement>
        <span>
          Habitica Keys not set. You can set it in{" "}
          <Link
            as={NextLink}
            href="/settings"
            color="secondary"
            underline="always"
          >
            Settings
          </Link>
          .
        </span>
      </ErrorElement>
    );

  const habiticaKeys: HabiticaKeys = Habitica.unfoldKeys(user.habiticaKeys);

  const burstCountShortcut = user.shortcuts.find(
    (s) => s.title === "burstCount"
  );

  const burstCount = (burstCountShortcut?.command as string) || "1";

  const initial: QuestGameState = {
    party: "tanglo",
    moment: 0,
    boss: {
      hp: 5000,
      maxHp: 5000,
    },
    players: [
      {
        skill1: 0,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-2 p-2 w-full sm:w-96 ">
      {/* Skeleton here */}
      <QuestScreen burstCount={burstCount} initial={initial} />
    </div>
  );
}

function ErrorElement({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-2">
      <Card className="p-2 text-center text-danger">{children}</Card>
    </div>
  );
}
