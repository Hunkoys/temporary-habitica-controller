export type HabiticaCreds = {
  habiticaApiUser: string; // x-api-user
  habiticaApiKey: string; // x-api-key
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
