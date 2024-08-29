import { Button } from '@nextui-org/button';
import { Dropdown as NextUIDropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/dropdown';
import { SharedSelection } from '@nextui-org/system';
import React, { useCallback, useMemo, useState } from 'react';

function isItem<T>(i: unknown, items: readonly T[]): i is T {
  return items.includes(i as T);
}

export default function Dropdown<T extends string>({
  className,
  onSelectionChange,
  items,
  label,
  selectedValue,
}: {
  className?: string;
  onSelectionChange: (selectedItem: T) => void;
  items: readonly T[];
  label?: string;
  selectedValue?: T;
}) {
  const setSelectedItem = useCallback(({ currentKey }: SharedSelection) => {
    if (isItem(currentKey, items)) {
      onSelectionChange(currentKey);
    }
  }, []);

  return (
    <NextUIDropdown className={className}>
      <DropdownTrigger className="w-full">
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
