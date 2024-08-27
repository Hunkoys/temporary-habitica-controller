import db from '@/prisma/db';
import { DatePicker } from '@nextui-org/date-picker';

interface DateRepeat {
  date: Date;
  every: number;
  unit: 'day' | 'month' | 'year';
  relativeTo: 'date' | 'firstday' | 'lastday' | 'firstweek' | 'lastweek'; // 'does not apply for 'day' unit
}

export default async function Home() {
  return (
    <main>
      <form action="" className="flex flex-col gap-1 m-4 px-80">
        <DatePicker label="Date" variant="faded" showMonthAndYearPickers visibleMonths={2} radius="md" />
        <Drop
      </form>
    </main>
  );
}
