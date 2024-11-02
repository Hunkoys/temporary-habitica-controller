"use client";

import { getUserData, habFetch } from "@/app/_UTILS/habitica";
import { getContent } from "@/app/_UTILS/habiticaContent";
import {
  Content,
  Credentials,
  Gear,
  GEAR_TYPES,
  GearType,
  PlayerClass,
  Stats,
} from "@/app/_UTILS/habiticaTypes";
import { saveAutoAssignCommand } from "@/app/shortcuts/actions";

export async function equipMax(
  stat: keyof Stats,
  creds: Credentials,
  content: Content | null
): Promise<boolean> {
  if (!creds) return false;
  const body = await getUserData(
    creds,
    "items.gear.owned,items.gear.equipped,stats.class"
  );
  if (!body) return false;

  const { owned, equipped: equippedKeys } = body.items.gear;
  const playerClass = body.stats.class;
  if (!owned) return false;
  if (!equippedKeys) return false;

  const inPossession = Object.keys(owned).filter((key) => owned[key]);
  if (!inPossession.length) return false;

  if (!content) {
    content = await getContent();
  }
  if (!content?.gear?.flat) return false;
  const gearlist = content.gear.flat;

  type keyOfMax = GearType | "twoHandedWeapon";

  const max: {
    [key in keyOfMax]?: Gear;
  } = {};

  function getMaxKey(item: Gear): keyOfMax {
    if (item.type === "weapon" && item.twoHanded) return "twoHandedWeapon";
    return item.type;
  }

  const classStatMap = {
    rogue: "per",
    warrior: "str",
    wizard: "int",
    healer: "con",
  } as const;

  function getAdjustedGear(gear: Gear, playerClass: PlayerClass) {
    const adjustedGear = { ...gear };
    if (
      gear.klass === playerClass ||
      (gear.klass === "special" && gear.specialClass === playerClass)
    ) {
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

  function comboStats(combo: { weapon?: Gear; shield?: Gear }) {
    return (combo.weapon?.[stat] || 0) + (combo.shield?.[stat] || 0);
  }

  const comboMax = comboStats(max);
  if (max.twoHandedWeapon && max.twoHandedWeapon[stat] > comboMax) {
    max.weapon = max.twoHandedWeapon;
    delete max.shield;
  }

  const equipped: {
    [key in GearType]?: Gear;
  } = {};

  GEAR_TYPES.forEach((type) => {
    if (!equippedKeys[type]) return;
    const gear = gearlist[equippedKeys[type]];
    if (!gear) return;
    equipped[type] = getAdjustedGear(gear, playerClass);
  });

  const toEquip: {
    [key in GearType]?: Gear;
  } = {};

  GEAR_TYPES.forEach((type) => {
    const maxGear = max[type];
    if (!maxGear) return;

    if (
      maxGear === max.twoHandedWeapon &&
      maxGear[stat] > comboStats(equipped)
    ) {
      toEquip.weapon = maxGear;
    } else if (maxGear[stat] > (equipped?.[type]?.[stat] || 0)) {
      toEquip[type] = maxGear;
    }
  });

  console.log(toEquip);

  for (const item of Object.values(toEquip)) {
    if (!item) continue;
    const res = await habFetch(
      "post",
      `user/equip/equipped/${item.key}`,
      creds
    );
    const body = await res.json();
    console.log(body.message);
    if (!body.success) {
      console.error(body.message);
      return false;
    }
  }

  return true;
}

const domain = process.env.NEXT_PUBLIC_DOMAIN;
console.log(domain);
const LEVEL_UUID = "32407f79-dbad-471a-9b69-98722b170079"; // save to command{}
export async function updateAutoAssignStat(
  id: string,
  creds: Credentials,
  stat: keyof Stats,
  status: boolean
) {
  const shortcut = await saveAutoAssignCommand(id, { stat, status });
  if (!shortcut)
    throw new Error("Failed to save auto assign stat command in database");

  const res = await habFetch("get", "user/webhook", creds);
  const body = await res.json();
  const webhooks = body.data;
  const levelWebhook = webhooks.find(
    ({ id }: { id: string }) => id === LEVEL_UUID
  );
  if (!levelWebhook) {
    const res = await habFetch("post", "user/webhook", creds, {
      id: LEVEL_UUID,
      enabled: status,
      url: domain + "/api/webhooks/level",
      label: "Level Webhook",
      type: "userActivity",
      options: {
        leveledUp: true,
      },
    });
    if (!res) throw new Error("Failed to create level webhook");
  } else {
    const res = await habFetch("put", `user/webhook/${LEVEL_UUID}`, creds, {
      enabled: status,
    });
    if (!res) throw new Error("Failed to update level webhook");
  }

  return shortcut;
}

// Temporary

export async function castBurstOfFlames(creds: Credentials) {
  const res = await habFetch("get", "tasks/user", creds);
  const body = await res.json();
  if (!body.success) return false;
  const tasks = body.data as Array<{ value: number; id: string; type: string }>;
  // get task with max value that is not of type 'reward'
  const maxValueTask = tasks.reduce(
    (max, task) => {
      if (task.type === "reward") return max;
      return task.value > max.value ? task : max;
    },
    { value: 0, id: "", type: "" }
  );
  if (!maxValueTask.id) return false;

  console.log(maxValueTask);

  const res2 = await habFetch(
    "post",
    `user/class/cast/fireball?targetId=${maxValueTask.id}`,
    creds
  );
  const body2 = await res2.json();
  if (!body2.success) {
    console.error(body2.message);
    return false;
  }

  console.log(`Casted on ${maxValueTask.id} with value ${maxValueTask.value}`);

  return true;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function emptyOutManaForBurstOfFlames(creds: Credentials) {
  const res = await habFetch("get", "user?userFields=stats.mp", creds);
  const body = await res.json();
  if (!body.success) return false;

  const burstCount = Math.floor(body.data.stats.mp / 10);
  if (burstCount === 0) return false;

  for (let i = 0; i < burstCount; i++) {
    await sleep(1000);
    const cast = await castBurstOfFlames(creds);
    if (!cast) return false;
  }

  return true;
}
