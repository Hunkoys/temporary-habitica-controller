export type HabiticaKeys = {
  id: string; // x-api-user (User ID)
  token: string; // x-api-key (API Token)
};

export type HabiticaPlayerClass = "warrior" | "wizard" | "healer" | "rogue";
export const HABITICA_GEAR_TYPES = [
  "weapon",
  "shield",
  "head",
  "armor",
  "body",
  "back",
  "headAccessory",
  "eyewear",
] as const;
export type HabiticaGearType = (typeof HABITICA_GEAR_TYPES)[number];
export type HabiticaGearClass =
  | "base"
  | "mystery"
  | "armoire"
  | HabiticaPlayerClass;

export const HABITICA_STATS = ["str", "int", "per", "con"] as const;
export type HabiticaStats = {
  [key in (typeof HABITICA_STATS)[number]]: number;
};

type HabiticaGearBase = HabiticaStats & {
  key: string;
};

export type HabiticaGear =
  | (HabiticaGearBase & {
      type: Exclude<HabiticaGearType, "weapon">;
      klass: HabiticaGearClass;
    })
  | (HabiticaGearBase & {
      type: "weapon";
      klass: HabiticaGearClass;
      twoHanded?: boolean;
    })
  | (HabiticaGearBase & {
      type: Exclude<HabiticaGearType, "weapon">;
      klass: "special";
      specialClass?: HabiticaGearClass;
    })
  | (HabiticaGearBase & {
      type: "weapon";
      klass: "special";
      specialClass?: HabiticaGearClass;
      twoHanded?: boolean;
    });

export type HabiticaContent = {
  gear?: {
    flat: {
      [key: string]: HabiticaGear;
    };
  };
};

export type QuestGameState = {
  party: string;
  moment: number;
  boss?: {
    maxHp?: number;
    hp?: number;
    rage?: number;
  };
  players?: {
    id?: string;
    hp?: number;
    mana?: number;
    skill1?: number;
  }[];
};

export const GAME_STATE_ACTION = "game-state";
