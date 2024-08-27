import { Button } from '@nextui-org/button';
import { Dropdown as NextUIDropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/dropdown';
import { useCallback, useMemo, useState } from 'react';

export default function Dropdown<T extends string>({
  onSelectionChange,
  items,
  name,
  selectedValue,
}: {
  onSelectionChange: (selectedItem:T) => void;
  items: T[];
  name: string;
  selectedValue?: T;
}) {
  return (
    <NextUIDropdown>
      <DropdownTrigger>
        <Button variant="bordered" className="capitalize">
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={name}
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedValue}
        onAction={onSelectionChange}
        items={items.map((item) => ({ key: item, label: item } as const))
        
      >
        {items.map((item) => (
          <DropdownItem key={item as T} >{item}</DropdownItem>
        ))}
      </DropdownMenu>
    </NextUIDropdown>
  );
}
