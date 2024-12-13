"use client";

import Spells from "@/app/quest/_components/Spells";

export default function QuestScreen(props: { burstCount: string }) {
  return (
    <div>
      <Spells burstCount={props.burstCount} />
    </div>
  );
}
