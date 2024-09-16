'use client';

import CommonButton from '@/app/_components/CommonButton';
import { Content, Credentials } from '@/app/_utils/habiticaTypes';
import { equipMax } from '@/app/shortcuts/shortcutFunctions';
import { Card, CardBody, CardFooter, Popover, PopoverContent, PopoverTrigger, Spinner } from '@nextui-org/react';
import { JsonValue } from '@prisma/client/runtime/library';
import Image, { StaticImageData } from 'next/image';
import { useCallback, useState } from 'react';

import conScene from '@/assets/Scene_constitution.webp';
import intScene from '@/assets/Scene_intelligence.webp';
import perScene from '@/assets/Scene_perception.webp';
import strScene from '@/assets/Scene_strength.webp';

import listIcon from '@/assets/list-icon.png';
import clsx from 'clsx';

function ShortcutCard({
  image,
  onClick,
  children,
}: {
  image: StaticImageData;
  onClick?: () => Promise<boolean>;
  children: React.ReactNode;
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
        <Card className={clsx('h-36 border-1 border-transparent', { 'border-danger-500': !success })}>
          <div
            className={clsx('absolute bg-white opacity-30 blur-lg h-full w-full flex justify-center items-center', {
              hidden: !running,
            })}
          ></div>
          <CardBody className="overflow-hidden flex justify-center items-center">
            <Image src={image} alt="List Icon" height={80} />
          </CardBody>
          <CardFooter>
            <CommonButton className="w-full" onClick={handleClick} isDisabled={running}>
              <Spinner className={clsx('absolute z-40', { hidden: !running })} />
              {children}
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

export default function ShortcutsList({
  credentials,
  content,
  shortcuts,
}: {
  credentials: Credentials;
  content: Content;
  shortcuts: {
    id: string;
    title: string;
    command: JsonValue;
    profileId: string | null;
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

  return (
    <div className="w-full h-full overflow-auto flex flex-col justify-end gap-3">
      <ShortcutGroup title="Skills">
        <ShortcutCard image={listIcon}>Skill 1</ShortcutCard>
        <ShortcutCard image={listIcon}>Skill 2</ShortcutCard>
        <ShortcutCard image={listIcon}>Skill 3</ShortcutCard>
        <ShortcutCard image={listIcon}>Skill 4</ShortcutCard>
      </ShortcutGroup>
      <ShortcutGroup title="Equipment">
        <ShortcutCard image={perScene} onClick={equipMaxPerceptionHandler}>
          Max Perception
        </ShortcutCard>
        <ShortcutCard image={strScene} onClick={equipMaxStrengthHandler}>
          Max Strength
        </ShortcutCard>
        <ShortcutCard image={intScene} onClick={equipMaxIntelligenceHandler}>
          Max Intelligence
        </ShortcutCard>
        <ShortcutCard image={conScene} onClick={equipMaxConstitutionHandler}>
          Max Constitution
        </ShortcutCard>
      </ShortcutGroup>
    </div>
  );
}
