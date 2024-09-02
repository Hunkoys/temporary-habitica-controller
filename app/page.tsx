'use client';

import db from '@/prisma/db';
import { DatePicker } from '@nextui-org/date-picker';
import Dropdown from './components/Dropdown';
import { useEffect, useState } from 'react';
import { Input } from '@nextui-org/input';
import Select from './components/Select';

const unitItems = [
  ['day', 'Day'],
  ['month', 'Month'],
  ['year', 'Year'],
] as const;

const relativeToItems = [
  ['date', 'Date'],
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

const styles = {
  gap: 'gap-2',
};

export default function Home() {
  const [date, setDate] = useState<DateRepeat['date']>(new Date());
  const [every, setEvery] = useState<DateRepeat['every']>(1);
  const [unit, setUnit] = useState<DateRepeat['unit']>('day');
  const [relativeTo, setRelativeTo] = useState<DateRepeat['relativeTo']>('date');

  useEffect(() => {
    console.log(unit);
  }, [unit]);

  return (
    <main className="flex justify-center">
      <form action="" className={`flex flex-col m-4 w-11/12 md:w-[400px] ${styles.gap}`}>
        <DatePicker
          labelPlacement="outside-left"
          label="Date"
          variant="faded"
          showMonthAndYearPickers
          visibleMonths={2}
          radius="md"
        />
        <div className={`flex ${styles.gap} items-baseline`}>
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
          <Select items={unitItems} label="Interval" onSelectionChange={setUnit} backdrop="opaque" />
          {/* <Dropdown<typeof unit>
            className={`w-full`}
            label="Interval"
            items={['Day', 'Month', 'Year']}
            selectedValue={unit}
            onSelectionChange={setUnit}
          /> */}
        </div>
        <Select items={relativeToItems} label="Relative to" onSelectionChange={setRelativeTo} backdrop="opaque" />
      </form>
    </main>
  );
}
