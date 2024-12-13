"use client";

import { listen } from "@/app/_lib/ampeer/client";
import { GameStatePartial, QuestPayload } from "@/app/_utils/quest/types";
import { useEffect, useRef, useState } from "react";

export function useQuestState(initialGameState: GameStatePartial) {
  const last = useRef(0);

  const [gameState, setGameState] =
    useState<GameStatePartial>(initialGameState);

  useEffect(() => {
    async function connect() {
      const run = last.current++;
      console.log(`before ${last.current}`);
      const postResponse = await fetch("/api/quest/enter", {
        method: "POST",
        headers: {}, // keepalive ?
      });
      if (postResponse.status !== 200) return;

      const id = await listen<QuestPayload>(postResponse, (payload) => {
        console.log(`pay: ${payload.type}`);
        if (payload.type === "gameState")
          setGameState({ ...gameState, ...payload.data });
      });
      console.log(`after ${last.current}`);

      if (run === last.current) setGameState({ player: { peerId: id || "" } });

      return id;
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
