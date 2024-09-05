'use client';

import db from '@/prisma/db';
import { DatePicker } from '@nextui-org/date-picker';
import { useEffect, useState } from 'react';
import { Input } from '@nextui-org/input';
import { Calendar, DateValue } from '@nextui-org/calendar';
import { getLocalTimeZone, today } from '@internationalized/date';
import { Button } from '@nextui-org/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';

const unitItems = [
  ['day', 'Day'],
  ['month', 'Month'],
  ['year', 'Year'],
] as const;

const relativeToItems = [
  ['date', 'Date', 'bro'],
  ['firstday', 'First Day'],
  ['lastday', 'Last Day'],
  ['firstweek', 'First Week'],
  ['lastweek', 'Last Week'],
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

export default function Home() {
  const [counter, setCounter] = useState(0);
  return (
    <main>
      <h1>Welcome to the Home Page</h1>
      <p>This is a simple home page.</p>
      <p>Counter: {counter}</p>
      <button onClick={() => setCounter(counter + 1)}>Increment</button>
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
