// const unitMap = {
//   day: 'Day',
//   week: 'Week',
//   month: 'Month',
//   year: 'Year',
// };

import { Select } from '@nextui-org/select';
import { Tab, Tabs } from '@nextui-org/tabs';

// function Selector<T extends { readonly [key: string]: string }>({
//   options,
//   selected,
//   onSelect,
// }: {
//   options: T;
//   selected?: keyof T;
//   onSelect?: (item: keyof T) => void;
// }) {
//   console.log(selected);
//   readline.question(`Select a unit (${Object.entries(options).length}): `, (unit: string) => {
//     if (unit in options) {
//       onSelect && onSelect(unit);
//     } else onSelect && selected && onSelect(selected);
//   });
// }

// Selector({ options: unitMap, selected: 'week', onSelect: (unit) => console.log(unit)});

export default function Selector({
  options,
  selected,
  onSelect,
}: {
  options: { readonly [key: string]: string };
  selected?: string;
  onSelect?: (item: string) => void;
}) {
  return (
    <Tabs color="primary" variant="solid" items={Object.entries(options)}>
      {(item) => <Tab key={item[0]} title={item[1]} />}
    </Tabs>
  );
}
