"use client";

import { listen } from "@/app/_lib/ampeer/client";
import { GameStatePartial, QuestPayload } from "@/app/_utils/quest/types";
import { useEffect, useState } from "react";

export function useQuestState(initialGameState: GameStatePartial) {
  const [gameState, setGameState] =
    useState<GameStatePartial>(initialGameState);

  useEffect(() => {
    async function connect() {
      const postResponse = await fetch("/api/quest/enter", {
        method: "POST",
        headers: {}, // keepalive ?
      });
      if (postResponse.status !== 200) return;

      return listen<QuestPayload>(postResponse, (payload) => {
        if (payload.type === "gameState")
          setGameState({ ...gameState, ...payload.data });
      });
    }

    const connection = connect();

    return () => {
      async function disconnect() {
        const id = await connection;
        if (id == null) return;
        await fetch(`/api/quest/leave?id=${id}`, {
          method: "DELETE",
        });
      }

      disconnect();
    };
  }, []);

  return gameState;
}
