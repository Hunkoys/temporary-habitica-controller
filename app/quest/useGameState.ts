"use client";

import { GAME_STATE_ACTION, QuestGameState } from "@/app/_types/habitica.types";
import usePusher from "@/app/_utils/pusher/usePusher";
import { useState } from "react";

export function useGameState(initial: QuestGameState) {
  const [gameState, setGameState] = useState(initial);

  usePusher(initial.party, (on) => {
    on(GAME_STATE_ACTION, (newGS: QuestGameState) => {
      if (newGS.moment > gameState.moment)
        setGameState((oldGS) => {
          return { ...oldGS, ...newGS };
        });
    });
  });

  return gameState;
}
