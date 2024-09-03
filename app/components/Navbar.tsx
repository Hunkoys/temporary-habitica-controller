'use client';
import CommonButton from '@/app/components/CommonButton';
import DragPick from '@/app/components/DragPick';
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  Selection,
  SelectItem,
  Slider,
  SliderValue,
  Tab,
  Tabs,
} from '@nextui-org/react';
import { useState } from 'react';

const tabs = ['Home', 'Tasks', 'Habits'] as const;

export default function Navbar() {
  const [currentTab, setCurrentTab] = useState<SliderValue>(1);

  return (
    <nav className="flex justify-start w-24 h-24 border-1 border-primary rounded-xl fixed bottom-2 right-0">
      <Slider
        className=""
        orientation="vertical"
        showSteps
        step={1}
        minValue={0}
        maxValue={2}
        defaultValue={0}
        fillOffset={Array.isArray(currentTab) ? currentTab[0] : currentTab}
        value={currentTab}
        onChange={setCurrentTab}
        marks={[
          { value: 0, label: 'Home' },
          { value: 1, label: 'Tasks' },
          { value: 2, label: 'Habits' },
        ]}
      />
    </nav>
  );
}
