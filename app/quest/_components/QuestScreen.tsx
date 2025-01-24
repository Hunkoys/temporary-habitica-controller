"use client";

import { QuestGameState } from "@/app/_types/habitica.types";
import Spells from "@/app/quest/_components/Spells";
import { useGameState } from "@/app/quest/useGameState";

export default function QuestScreen(props: {
  burstCount: string;
  initial: QuestGameState;
}) {
  const gameState = useGameState(props.initial);

  return (
    <div>
      <Spells burstCount={props.burstCount} gameState={gameState} />
    </div>
  );
}
