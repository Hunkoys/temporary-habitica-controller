"use client";

import { Button, Card, CardBody, CardFooter, Input } from "@nextui-org/react";
import fireball from "@/assets/shop_fireball.png";
import NextImage from "next/image";
import { useCallback, useState } from "react";
import { saveBurstCount } from "@/app/shortcuts/actions";

export default function ShortcutsSpells({
  burstCount: propBurstCount,
}: {
  burstCount: string;
}) {
  const [burstCount, setBurstCount] = useState(propBurstCount);
  const [isSavingBurstCount, setIsSavingBurstCount] = useState(false);

  const onBurstOfFlames = useCallback(async () => {
    setIsSavingBurstCount(true);
    await saveBurstCount(burstCount);
    setIsSavingBurstCount(false);
  }, [burstCount]);

  return (
    <div>
      <Card
        shadow="sm"
        className="flex flex-row items-center p-2 gap-2 w-full justify-between"
      >
        <CardBody className="p-0 flex flex-row gap-2 items-center">
          <Button
            variant="light"
            className="p-0 w-full flex justify-start"
            onClick={onBurstOfFlames}
            isLoading={isSavingBurstCount}
            spinnerPlacement="end"
          >
            <NextImage
              alt={"fireball"}
              height={40}
              width={40}
              className="bg-blue-700 rounded-xl"
              src={fireball}
            />
            <div className="font-bold h-fit">Burst Of Flames</div>
          </Button>
        </CardBody>
        <CardFooter className="text-small p-0 flex flex-row items-baseline gap-1 w-fit">
          x
          <Input
            min={0}
            type="number"
            className="w-20 h-full"
            value={burstCount}
            onValueChange={setBurstCount}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
