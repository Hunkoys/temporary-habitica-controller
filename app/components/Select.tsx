import { Button } from '@nextui-org/button';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/dropdown';
import { SharedSelection } from '@nextui-org/system';
import React, { useCallback, useMemo, useState } from 'react';

const KEY = 0;
const DISPLAY = 1;
const DESCRIPTION = 2;
type Item<Key extends React.Key, Display extends React.Key, Description extends string> = readonly [
  Key,
  Display?,
  Description?
];

export default function Select<T extends Item<string, string, string>>({
  items,
  label,
  onSelectionChange,
  backdrop,
}: {
  items: readonly T[];
  label?: string;
  onSelectionChange?: (selectedItem: T[typeof KEY]) => void;
  backdrop?: 'blur' | 'transparent' | 'opaque';
}) {
  const [selectedKey, setSelectedKey] = useState<T[typeof KEY]>(items[0][KEY]);
  const selectedItem = useMemo(() => {
    return items.find(([key]) => key === selectedKey);
  }, [items, selectedKey]);

  const setSelectedItem = useCallback(
    ({ currentKey }: SharedSelection) => {
      if (currentKey) {
        setSelectedKey(currentKey as T[typeof KEY]);
        if (onSelectionChange) onSelectionChange(currentKey as T[typeof KEY]);
      }
    },
    [items, onSelectionChange]
  );

  return (
    <Dropdown backdrop={backdrop}>
      <DropdownTrigger>
        <Button variant="faded">{selectedItem ? selectedItem[DISPLAY] : ''}</Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={label}
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        onSelectionChange={setSelectedItem}
        items={items}
      >
        {(item) => (
          <DropdownItem key={item[KEY]} description={item[DESCRIPTION]}>
            {item[DISPLAY]}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}

// function isItem<T>(i: unknown, items: readonly T[]): i is T {
//   return items.includes(i as T);
// }
