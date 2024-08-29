import { Button } from '@nextui-org/button';
import { Dropdown as NextUIDropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/dropdown';
import { SharedSelection } from '@nextui-org/system';
import React, { useCallback, useMemo, useState } from 'react';

// type Option<T extends string> = {
//   [key in T]: string;
// };

// const units = ['day', 'month', 'year'] as const;

// const options: Option<(typeof units)[number]> = {
//   day: 'Day',
//   month: 'Month',
//   year: 'Year',
// } as const;

function name<O extends string, S extends O>({
  items,
  selected,
}: {
  items: { readonly [key in O]: string | undefined };
  selected?: S;
}) {
  return items;
}

const a = name({
  items: {
    day: 'Day',
    year: 'Year',
  },
  selected: 'year',
});

export default function Dropdown<T extends string>({
  items,
  selectedValue,
  label,
  onSelectionChange,
}: {
  items: readonly { key: T; label: string }[];
  selectedValue?: T;
  label: string;
  onSelectionChange: (selectedItem: T) => void;
}) {
  const setSelectedItem = useCallback(({ currentKey }: SharedSelection) => {
    if (isItem(currentKey, items)) {
      onSelectionChange(currentKey);
    }
  }, []);

  return (
    <NextUIDropdown>
      <DropdownTrigger>
        <Button variant="faded">{selectedValue}</Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={label}
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedValue ? [selectedValue] : []}
        onSelectionChange={setSelectedItem}
        items={items.map((item) => ({ key: item, label: item }))}
      >
        {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
      </DropdownMenu>
    </NextUIDropdown>
  );
}

// function isItem<T>(i: unknown, items: readonly T[]): i is T {
//   return items.includes(i as T);
// }
