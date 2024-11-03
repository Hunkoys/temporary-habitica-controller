"use client";

import db from "@/prisma/db";
import { DatePicker } from "@nextui-org/date-picker";
import { useCallback, useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Calendar, DateValue } from "@nextui-org/calendar";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Button } from "@nextui-org/button";
import {
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  ScrollShadow,
} from "@nextui-org/react";
import CommonButton from "@/app/_components/elements/CommonButton";

function AddIcon({ className = "fill-white" }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.5 1.75C6.5 1.55109 6.42098 1.36032 6.28033 1.21967C6.13968 1.07902 5.94891 1 5.75 1C5.55109 1 5.36032 1.07902 5.21967 1.21967C5.07902 1.36032 5 1.55109 5 1.75V5H1.75C1.55109 5 1.36032 5.07902 1.21967 5.21967C1.07902 5.36032 1 5.55109 1 5.75C1 5.94891 1.07902 6.13968 1.21967 6.28033C1.36032 6.42098 1.55109 6.5 1.75 6.5H5V9.75C5 9.94891 5.07902 10.1397 5.21967 10.2803C5.36032 10.421 5.55109 10.5 5.75 10.5C5.94891 10.5 6.13968 10.421 6.28033 10.2803C6.42098 10.1397 6.5 9.94891 6.5 9.75V6.5H9.75C9.94891 6.5 10.1397 6.42098 10.2803 6.28033C10.421 6.13968 10.5 5.94891 10.5 5.75C10.5 5.55109 10.421 5.36032 10.2803 5.21967C10.1397 5.07902 9.94891 5 9.75 5H6.5V1.75Z"
        className={className}
      />
    </svg>
  );
}

const unitItems = [
  ["day", "Day"],
  ["month", "Month"],
  ["year", "Year"],
] as const;

const relativeToItems = [
  ["date", "Date", "bro"],
  ["firstday", "First Day"],
  ["lastday", "Last Day"],
  ["firstweek", "First Week"],
  ["lastweek", "Last Week"],
] as const;

interface DateRepeat {
  date: Date;
  every: number;
  unit: (typeof unitItems)[number][0];
  relativeTo: (typeof relativeToItems)[number][0];
}

function getToday() {
  return today(getLocalTimeZone());
}

function Item({
  children: value,
  ...props
}: { children?: string } & React.ComponentProps<typeof Card>) {
  return (
    <Card {...props} className="p-2 bg-matter w-full">
      <Input size="sm" />
    </Card>
  );
}

export default function Home() {
  const [items, setItems] = useState<string[]>([]);
  const addItem = useCallback(() => {
    setItems((prev) => [...prev, ""]);
  }, []);

  return (
    <main className="flex flex-col p-2 overflow-auto grow w-full">
      <div className="flex flex-col justify-end items-end gap-1 grow relative">
        {items.map((item, index) => (
          <Item key={index}>{item}</Item>
        ))}

        <Card className="p-1 mx-2 mt-2 bg-matter sticky bottom-0">
          <CommonButton
            isIconOnly
            onClick={addItem}
            color="primary"
            variant="solid"
          >
            <AddIcon />
          </CommonButton>
        </Card>
      </div>
    </main>
  );
}
/* 

  let [date, setDate] = useState<DateValue>(today(getLocalTimeZone()));
  const [every, setEvery] = useState<DateRepeat['every']>(1);
  const [unit, setUnit] = useState<DateRepeat['unit']>('day');
  const [relativeTo, setRelativeTo] = useState<DateRepeat['relativeTo']>('date');

  useEffect(() => {
    console.log(date.toDate(getLocalTimeZone()));
  }, [date]);

  return (
    <main className="flex justify-center">
      <form
        action=""
        className="flex flex-col items-stretch m-2 p-4 rounded-2xl  w-11/12 md:w-[400px] gap-default bg-matter"
      >
        <div className="flex justify-center ">
          <Calendar
            aria-label="Date"
            showMonthAndYearPickers
            value={date}
            onChange={setDate}
            topContent={
              <div className="flex p-2 bg-matter">
                <Button variant="bordered">Today</Button>
              </div>
            }
          />
        </div>

        <div className={`flex gap-default items-baseline`}>
          <Input
            labelPlacement="outside-left"
            className="w-56"
            label="Every"
            type="number"
            variant="faded"
            min={0}
            max={10000}
            value={every.toString()}
            onChange={(e) => setEvery(parseInt(e.target.value))}
          />

          <Select className="w-full" items={unitItems} label="Interval" onSelectionChange={setUnit} backdrop="opaque" />
        </div>
        <div className="flex">
          {}
          <Select items={relativeToItems} label="Relative to" onSelectionChange={setRelativeTo} backdrop="opaque" />
        </div>
      </form>
    </main>
  */
