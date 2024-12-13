"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
  Progress,
} from "@nextui-org/react";
import fireball from "@/assets/shop_fireball.png";
import NextImage from "next/image";
import { useCallback, useState } from "react";
import { burst } from "@/app/quest/actions";
import usePusher from "@/app/_utils/usePusher";

export default function Spells({
  burstCount: propBurstCount,
}: {
  burstCount: string;
}) {
  const [burstCount, setBurstCount] = useState(propBurstCount);
  const [isSavingBurstCount, setIsSavingBurstCount] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  usePusher((bind) => {
    bind("tampoy", (data: { bossHp: number }) => {
      setProgress(data.bossHp);
    });
  });

  const onBurstOfFlames = useCallback(async () => {
    setIsSavingBurstCount(true);
    burst(parseInt(burstCount));
    setIsSavingBurstCount(false);
  }, [burstCount]);

  return (
    <div>
      <Card shadow="sm" className="p-2 gap-2 w-full justify-between">
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
            <div className="font-bold h-fit">Burst Of Flames</div>(
            {Number(burstCount) * 10} Mana)
          </Button>
          <div className="flex items-center gap-1">
            x
            <Input
              min={0}
              type="number"
              className="w-20 h-full"
              value={burstCount}
              onValueChange={setBurstCount}
            />
          </div>
        </CardBody>
        <CardFooter className=" flex flex-row items-baseline gap-1">
          <Progress
            aria-label="asd"
            value={progress}
            minValue={0}
            maxValue={5000}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
