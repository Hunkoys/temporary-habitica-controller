export type HabiticaEventMap = {
  bossDamage: {
    hp: number;
  };
  playerDamage: {
    som: number;
    mana: number;
  };
};

export type HabiticaEvent<T extends keyof HabiticaEventMap> =
  HabiticaEventMap[T];
