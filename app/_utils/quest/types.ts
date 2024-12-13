import { Payload } from "@/app/_lib/ampeer/types";

export type GameState = {
  player: {
    peerId: string;
    hp: number;
    mana: number;
  };
  boss: {
    hp: number;
  };
};

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type GameStatePartial = DeepPartial<GameState>;

export type QuestPayload = {
  type: "gameState";
  data: GameStatePartial;
};
