'use client';

import { getUserData, habFetch } from '@/app/_utils/habitica';
import { getContent } from '@/app/_utils/habiticaContent';
import { Content, Credentials, Gear, GEAR_TYPES, GearType, PlayerClass, Stats } from '@/app/_utils/habiticaTypes';

export async function equipMax(stat: keyof Stats, creds: Credentials, content: Content | null): Promise<boolean> {
  if (!creds) return false;
  const body = await getUserData(creds, 'items.gear.owned,items.gear.equipped,stats.class');
  if (!body) return false;

  const { owned, equipped } = body.items.gear;
  const playerClass = body.stats.class;
  if (!owned) return false;
  if (!equipped) return false;

  const inPossession = Object.keys(owned).filter((key) => owned[key]);
  if (!inPossession.length) return false;

  if (!content) {
    content = await getContent();
  }
  if (!content?.gear?.flat) return false;
  const gearlist = content.gear.flat;

  type keyOfMax = GearType | 'twoHandedWeapon';

  const max: {
    [key in keyOfMax]?: Gear;
  } = {};

  function getMaxKey(item: Gear): keyOfMax {
    if (item.type === 'weapon' && item.twoHanded) return 'twoHandedWeapon';
    return item.type;
  }

  const classStatMap = { rogue: 'per', warrior: 'str', wizard: 'int', healer: 'con' } as const;

  function getAdjustedGear(gear: Gear, playerClass: PlayerClass) {
    const adjustedGear = { ...gear };
    if (gear.klass === playerClass || (gear.klass === 'special' && gear.specialClass === playerClass)) {
      const playerMainStat = classStatMap[playerClass];
      adjustedGear[playerMainStat] = gear[playerMainStat] * 1.5;
    }

    return adjustedGear;
  }

  inPossession.forEach((key) => {
    const stockGear = gearlist[key];
    if (!stockGear) return;
    const gear = getAdjustedGear(stockGear, playerClass);
    const maxKey = getMaxKey(gear);

    if (gear[stat] > (max[maxKey]?.[stat] || 0)) {
      max[maxKey] = gear;
    }
  });

  function combo(stat: keyof Stats, setup: { weapon?: Gear; shield?: Gear }) {
    return (setup.weapon?.[stat] || 0) + (setup.shield?.[stat] || 0);
  }

  const toEquip: {
    [key in GearType]?: Gear;
  } = {};

  GEAR_TYPES.forEach((type) => {
    if (!max[type]) return;
    if (type === 'weapon' || type === 'shield') return;
    if (max[type][stat] > getAdjustedGear(gearlist[equipped[type]], playerClass)[stat]) {
      toEquip[type] = max[type];
    }
  });

  const equippedStats = combo(stat, {
    weapon: getAdjustedGear(gearlist[equipped.weapon], playerClass),
    shield: getAdjustedGear(gearlist[equipped.shield], playerClass),
  });

  if (equippedStats < combo(stat, { weapon: max.twoHandedWeapon })) {
    toEquip.weapon = max.twoHandedWeapon;
  }
  if (equippedStats < combo(stat, max)) {
    toEquip.weapon = max.weapon;
    toEquip.shield = max.shield;
  }

  for (const item of Object.values(toEquip)) {
    if (!item) continue;
    const res = await habFetch('post', `user/equip/equipped/${item.key}`, creds);
    const body = await res.json();
    if (!body.success) {
      console.error(body.message);
      return false;
    }
  }

  return true;
}
