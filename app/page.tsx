'use client';

import db from '@/prisma/db';
import { DatePicker } from '@nextui-org/date-picker';
import Dropdown from './components/Dropdown';
import { useState } from 'react';
import { Input } from '@nextui-org/input';

const unitMap = {
  Day: 'day',
  Month: 'month',
  Year: 'year',
} as const;
type UnitDisplay = keyof typeof unitMap;

const relativeToMap = {
  Date: 'date',
  FirstDay: 'firstday',
  LastDay: 'lastday',
  FirstWeek: 'firstweek',
  LastWeek: 'lastweek',
} as const;
type RelativeToDisplay = keyof typeof relativeToMap;

interface DateRepeat {
  date: Date;
  every: number;
  unit: (typeof unitMap)[UnitDisplay];
  relativeTo: 'date' | 'firstday' | 'lastday' | 'firstweek' | 'lastweek'; // 'does not apply for 'day' unit
}

export default function Home() {
  const [date, setDate] = useState<DateRepeat['date']>(new Date());
  const [every, setEvery] = useState<DateRepeat['every']>(1);
  const [unit, setUnit] = useState<UnitDisplay>('Day');
  const [relativeTo, setRelativeTo] = useState<DateRepeat['relativeTo']>('date');

  console.log(unitMap[unit]);

  return (
    <main className="flex justify-center">
      <form action="" className="flex flex-col gap-1 m-4 w-11/12 md:w-[400px]">
        <DatePicker label="Date" variant="faded" showMonthAndYearPickers visibleMonths={2} radius="md" />
        <Input
          label="Every"
          type="number"
          variant="faded"
          min={0}
          max={10000}
          value={every.toString()}
          onChange={(e) => setEvery(parseInt(e.target.value))}
        />
        <Dropdown<typeof unit>
          label="Interval"
          items={['Day', 'Month', 'Year']}
          selectedValue={unit}
          onSelectionChange={setUnit}
        />
      </form>
    </main>
  );
}
