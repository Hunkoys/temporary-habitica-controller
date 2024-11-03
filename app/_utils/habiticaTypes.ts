export type PlayerClass = 'warrior' | 'wizard' | 'healer' | 'rogue';
export const GEAR_TYPES = ['weapon', 'shield', 'head', 'armor', 'body', 'back', 'headAccessory', 'eyewear'] as const;
export type GearType = (typeof GEAR_TYPES)[number];
export type GearClass = 'base' | 'mystery' | 'armoire' | PlayerClass;

export const STATS = ['str', 'int', 'per', 'con'] as const;
export type Stats = {
  [key in (typeof STATS)[number]]: number;
};

type GearBase = Stats & {
  key: string;
};

export type Gear =
  | (GearBase & {
      type: Exclude<GearType, 'weapon'>;
      klass: GearClass;
    })
  | (GearBase & {
      type: 'weapon';
      klass: GearClass;
      twoHanded?: boolean;
    })
  | (GearBase & {
      type: Exclude<GearType, 'weapon'>;
      klass: 'special';
      specialClass?: GearClass;
    })
  | (GearBase & {
      type: 'weapon';
      klass: 'special';
      specialClass?: GearClass;
      twoHanded?: boolean;
    });

export type Content = {
  gear: {
    flat: {
      [key: string]: Gear;
    };
  };
};

export type Credentials = { habId: string; apiKey: string };
