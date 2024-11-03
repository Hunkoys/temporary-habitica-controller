import { getUser } from "@/app/_actions/db";
import { HabiticaKeys } from "@/app/_types/habitica.types";
import { Habitica } from "@/app/_utils/habitica";
import ShortcutsSpells from "@/app/shortcuts/_components/Spells";
import { Card } from "@nextui-org/react";

export default async function ShortcutsPage() {
  const user = await getUser({ shortcuts: true });
  if (user === null)
    return <ErrorElement>User not found in the database.</ErrorElement>;
  if (user.habiticaKeys === "")
    return (
      <ErrorElement>Habitica credentials not set in database.</ErrorElement>
    );

  const habiticaKeys: HabiticaKeys = Habitica.unfoldKeys(user.habiticaKeys);

  const burstCountShortcut = user.shortcuts.find(
    (s) => s.title === "burstCount"
  );

  const burstCount = (burstCountShortcut?.command as string) || "1";

  return (
    <div className="flex flex-col gap-2 p-2 w-full sm:w-96 ">
      <ShortcutsSpells burstCount={burstCount} />
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
