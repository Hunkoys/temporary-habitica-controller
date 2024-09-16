'use client';

import CommonButton from '@/app/_components/CommonButton';
import { Credentials } from '@/app/_utils/habiticaTypes';
import { equipMax } from '@/app/shortcuts/shortcutFunctions';
import { Card, CardBody, CardFooter } from '@nextui-org/react';
import { JsonValue } from '@prisma/client/runtime/library';
import Image, { StaticImageData } from 'next/image';
import { useCallback } from 'react';

import conScene from '@/assets/Scene_constitution.webp';
import intScene from '@/assets/Scene_intelligence.webp';
import perScene from '@/assets/Scene_perception.webp';
import strScene from '@/assets/Scene_strength.webp';

function ShortcutCard({
  image,
  onClick,
  children,
}: {
  image: StaticImageData;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card className="h-36">
      <CardBody className="overflow-hidden flex justify-center items-center">
        <Image src={image} alt="List Icon" height={80} />
      </CardBody>
      <CardFooter>
        <CommonButton className="w-full" onClick={onClick}>
          {children}
        </CommonButton>
      </CardFooter>
    </Card>
  );
}

export default function ShortcutsList({
  credentials,
  content,
  shortcuts,
}: {
  credentials: Credentials;
  content: object;
  shortcuts: {
    id: string;
    title: string;
    command: JsonValue;
    profileId: string | null;
  }[];
}) {
  const equipMaxPerceptionHandler = useCallback(() => {
    equipMax('per', credentials);
  }, []);

  const equipMaxStrengthHandler = useCallback(() => {
    equipMax('str', credentials);
  }, []);

  const equipMaxIntelligenceHandler = useCallback(() => {
    equipMax('int', credentials);
  }, []);

  const equipMaxConstitutionHandler = useCallback(() => {
    equipMax('con', credentials);
  }, []);

  return (
    <div className="w-full h-full overflow-auto flex flex-col justify-end">
      <h1 className="text-2xl font-bold p-2">Equipment</h1>
      <div className="p-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 max-w-[1200px] content-end">
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
      </div>
    </div>
  );
}
