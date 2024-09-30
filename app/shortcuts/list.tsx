'use client';

import CommonButton from '@/app/_components/CommonButton';
import { Content, Credentials, Stats } from '@/app/_utils/habiticaTypes';
import {
  updateAutoAssignStat,
  equipMax,
  castBurstOfFlames,
  useUpManaForBurstOfFlames,
} from '@/app/shortcuts/shortcutFunctions';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Switch,
} from '@nextui-org/react';
import { JsonValue } from '@prisma/client/runtime/library';
import Image, { StaticImageData } from 'next/image';
import { Key, useCallback, useEffect, useMemo, useState } from 'react';

import conScene from '@/assets/Scene_constitution.webp';
import intScene from '@/assets/Scene_intelligence.webp';
import perScene from '@/assets/Scene_perception.webp';
import strScene from '@/assets/Scene_strength.webp';
import autoAssignStatImage from '@/assets/auto-assign-stat.webp';
import fireball from '@/assets/shop_fireball.png';

import listIcon from '@/assets/list-icon.png';
import clsx from 'clsx';
import { getAutoAssignCommand } from '@/app/shortcuts/actions';

function ShortcutCard({
  image,
  onClick,
  children,
  actionText,
}: {
  image: StaticImageData;
  onClick?: () => Promise<boolean>;
  children: React.ReactNode;
  actionText: string;
}) {
  const [running, setRunning] = useState(false);
  const [success, setSuccess] = useState(true);

  const handleClick = useCallback(async () => {
    if (onClick) {
      setSuccess(true);
      setRunning(true);
      const res = await onClick();
      // const res = await new Promise<boolean>((resolve) => {
      //   setTimeout(() => resolve(false), 1000);
      // });
      setSuccess(res);
      setRunning(false);
    }
  }, [onClick]);

  const handleOpenChange = useCallback(() => setSuccess(true), []);

  return (
    <Popover
      placement="top"
      color="danger"
      isOpen={!success}
      shouldCloseOnBlur
      offset={-16}
      onOpenChange={handleOpenChange}
    >
      <PopoverTrigger>
        <Card className={clsx('border-1 border-transparent', { 'border-danger-500': !success })}>
          <div
            className={clsx('absolute bg-white opacity-30 blur-lg h-full w-full flex justify-center items-center', {
              hidden: !running,
            })}
          ></div>
          <CardBody className="overflow-hidden flex justify-center items-center">
            <Image src={image} alt="List Icon" height={80} />
            {children}
          </CardBody>
          <CardFooter>
            <CommonButton className="w-full" onClick={handleClick} isDisabled={running}>
              <Spinner className={clsx('absolute z-40', { hidden: !running })} />
              {actionText}
            </CommonButton>
          </CardFooter>
        </Card>
      </PopoverTrigger>
      <PopoverContent>Shortcut Failed</PopoverContent>
    </Popover>
  );
}

function ShortcutGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-2 flex flex-col gap-3">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 max-w-[1200px]">
        {children}
      </div>
    </div>
  );
}

function isStat(key: unknown): key is keyof Stats {
  return key === 'str' || key === 'int' || key === 'per' || key === 'con';
}
function AutoStatCard({ creds, id }: { creds: Credentials; id: string }) {
  const [isOn, setIsOn] = useState(false); // get from user shortcuts
  const [saving, setSaving] = useState(true);
  const [success, setSuccess] = useState(true);

  const selectionMap = [
    {
      stat: 'str',
      color: 'bg-red-500',
    },
    {
      stat: 'int',
      color: 'bg-blue-500',
    },
    {
      stat: 'per',
      color: 'bg-purple-500',
    },
    {
      stat: 'con',
      color: 'bg-orange-500',
    },
  ];
  const [stat, setStat] = useState('str');

  useEffect(() => {
    (async () => {
      const autoStat = await getAutoAssignCommand(id);
      console.log(autoStat);
      if (autoStat) {
        const command = autoStat.command as { stat: keyof Stats; status: boolean };
        setIsOn(command.status);
        setStat(command.stat);
      }
      setSaving(false);
      setSuccess(true);
    })();
  }, []);

  const handleOnChange = useCallback(
    async (key: Key) => {
      if (!isStat(key)) throw new Error('Invalid stat key in handleOnChange');
      setStat(key);
      setSaving(true);
      const result = await updateAutoAssignStat(id, creds, key, isOn);
      setSaving(false);
      if (!result) throw new Error('Failed to update auto assign stat command');
    },
    [isOn]
  );

  const handleSwitch = useCallback(
    async (isOn: boolean) => {
      setIsOn(isOn);
      if (!isStat(stat)) throw new Error('Invalid stat key in handleSwitch');
      setSaving(true);
      const result = await updateAutoAssignStat(id, creds, stat, isOn);
      setSaving(false);
      if (!result) throw new Error('Failed to update auto assign stat command');
    },
    [stat]
  );

  const color = useMemo(() => {
    return selectionMap.find((item) => item.stat === stat)?.color;
  }, [stat]);

  const handleOpenChange = useCallback(() => setSuccess(true), []);

  return (
    <Popover
      placement="top"
      color="danger"
      isOpen={!success}
      shouldCloseOnBlur
      offset={-16}
      onOpenChange={handleOpenChange}
    >
      <PopoverTrigger>
        <Card className={clsx('border-1 border-transparent', { 'border-danger-500': !success })}>
          <div
            className={clsx('absolute bg-white opacity-30 blur-lg h-full w-full flex justify-center items-center', {
              hidden: !saving,
            })}
          ></div>
          <CardBody className="overflow-hidden flex justify-center items-center">
            <Image src={autoAssignStatImage} alt="Level UP Image" height={80} className="rounded-lg" />
            Auto assign stat points
          </CardBody>
          <CardFooter className="flex justify-between gap-2 ">
            <Spinner className={clsx('absolute z-40 w-full', { hidden: !saving })} />
            <Dropdown>
              <DropdownTrigger className={color}>
                <Button className="capitalize">{stat}</Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Stat selection"
                variant="bordered"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={stat}
                onAction={handleOnChange}
              >
                {selectionMap.map(({ stat, color }) => (
                  <DropdownItem key={stat} value={stat} className={color}>
                    <div className="capitalize">{stat}</div>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <div className="flex gap-2 items-center">
              <Switch size="lg" isSelected={isOn} onValueChange={handleSwitch}></Switch>
            </div>
          </CardFooter>
        </Card>
      </PopoverTrigger>
      <PopoverContent>Shortcut Failed</PopoverContent>
    </Popover>
  );
}

export default function ShortcutsList({
  id,
  credentials,
  content,
  shortcuts,
}: {
  id: string;
  credentials: Credentials;
  content: Content;
  shortcuts: {
    id: string;
    title: string;
    command: JsonValue;
    userId: string;
  }[];
}) {
  const equipMaxPerceptionHandler = useCallback(() => {
    return equipMax('per', credentials, content);
  }, []);

  const equipMaxStrengthHandler = useCallback(() => {
    return equipMax('str', credentials, content);
  }, []);

  const equipMaxIntelligenceHandler = useCallback(() => {
    return equipMax('int', credentials, content);
  }, []);

  const equipMaxConstitutionHandler = useCallback(() => {
    return equipMax('con', credentials, content);
  }, []);

  const handleBurstOfFlames = useCallback(() => {
    return castBurstOfFlames(credentials);
  }, []);

  const handleAllOutFire = useCallback(() => {
    return useUpManaForBurstOfFlames(credentials);
  }, []);

  return (
    <div className="w-full flex flex-col justify-end gap-3">
      <ShortcutGroup title="Stats">
        <AutoStatCard creds={credentials} id={id} />
      </ShortcutGroup>
      <ShortcutGroup title="Equipment">
        <ShortcutCard image={perScene} actionText="Equip" onClick={equipMaxPerceptionHandler}>
          Max Perception
        </ShortcutCard>
        <ShortcutCard image={strScene} actionText="Equip" onClick={equipMaxStrengthHandler}>
          Max Strength
        </ShortcutCard>
        <ShortcutCard image={intScene} actionText="Equip" onClick={equipMaxIntelligenceHandler}>
          Max Intelligence
        </ShortcutCard>
        <ShortcutCard image={conScene} actionText="Equip" onClick={equipMaxConstitutionHandler}>
          Max Constitution
        </ShortcutCard>
      </ShortcutGroup>
      <ShortcutGroup title="Skills">
        <ShortcutCard image={fireball} actionText="Cast" onClick={handleBurstOfFlames}>
          Burst of Flames
        </ShortcutCard>
        <ShortcutCard image={fireball} actionText="Cast" onClick={handleAllOutFire}>
          All Out Fire
        </ShortcutCard>
        <ShortcutCard image={listIcon} actionText="Cast">
          Skill 3
        </ShortcutCard>
        <ShortcutCard image={listIcon} actionText="Cast">
          Skill 4
        </ShortcutCard>
      </ShortcutGroup>
    </div>
  );
}
