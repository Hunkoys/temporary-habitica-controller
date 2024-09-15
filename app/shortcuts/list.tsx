'use client';

import CommonButton from '@/app/_components/CommonButton';
import { Card, CardBody, CardFooter } from '@nextui-org/react';
import Image from 'next/image';
import listIcon from '@/assets/list-icon.png';
import { getUserData, habFetch } from '@/app/_utils/habitica';
import { useCallback, useMemo } from 'react';
import { Content, Gear, GearType, GEAR_TYPES, PlayerClass, Stats } from '@/app/_utils/habiticaTypes';

export default function ShortcutsList({
  user,
  content,
}: {
  user: { id: string; habiticaUserId: string | null; habiticaApiKey: string | null; linked: boolean; shortcuts: {}[] };
  content: object;
}) {
  const creds = useMemo(() => {
    if (user.habiticaUserId && user.habiticaApiKey) {
      return { habId: user.habiticaUserId, apiKey: user.habiticaApiKey };
    } else {
      return null;
    }
  }, [user.habiticaUserId, user.habiticaApiKey]);

  const equipMaxPerHandler = useCallback(() => {
    (async () => {
      let stat: keyof Stats = 'per';

      if (!creds) return;
      const body = await getUserData(creds, 'items.gear.owned,items.gear.equipped,stats.class');
      if (!body) return;

      const { owned, equipped } = body.items.gear;
      const playerClass = body.stats.class;
      if (!owned) return;
      if (!equipped) return;

      const inPossession = Object.keys(owned).filter((key) => owned[key]);
      if (!inPossession.length) return;

      const content = (await (await habFetch('get', 'content')).json()) as Content;
      if (!content?.data?.gear?.flat) return;
      const gearlist = content.data.gear.flat;

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
        if (!body.success) console.error(body.message);
      }
    })();
  }, []);

  return (
    <div className="p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 overflow-auto h-full w-full max-w-[1200px]">
      <Card className="h-36">
        <CardBody>
          <Image src={listIcon} alt="List Icon" width={50} height={50} />
        </CardBody>
        <CardFooter>
          <CommonButton className="w-full" onClick={equipMaxPerHandler}>
            Equip Max Strength
          </CommonButton>
        </CardFooter>
      </Card>
    </div>
  );
}
