import db from '@/prisma/db';
import { DatePicker } from '@nextui-org/date-picker';

export default async function Home() {
  return (
    <main>
      <form action="" className="flex flex-col gap-1 m-4 px-80">
        <DatePicker label="Date" variant="faded" showMonthAndYearPickers visibleMonths={2} radius="md" />
      </form>
    </main>
  );
}
