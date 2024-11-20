"use client";

import ShortcutsSpells from "@/app/shortcuts/_components/Spells";

export default function ShortcutsClientPage(props: { burstCount: string }) {
  return (
    <div>
      <ShortcutsSpells burstCount={props.burstCount} />
    </div>
  );
}
