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

export default function Navbar({ leftie = false }: { leftie?: boolean }) {
  const [currentTab, setCurrentTab] = useState<SliderValue>(1);

  return (
    <nav>
      <Tabs
        className="fixed bottom-2"
        aria-label="Navigation Tabs"
        placement={leftie ? 'start' : 'end'}
        color="primary"
        variant="bordered"
        defaultSelectedKey={'home'}
      >
        <Tab key="tasks" title="Tasks">
          <Card>
            <CardBody>
              Lorem at TASKS ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </CardBody>
          </Card>
        </Tab>
        <Tab key="habits" title="Habits">
          <Card>
            <CardBody>
              Lorem at HABITS ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </CardBody>
          </Card>
        </Tab>
        <Tab key="home" title="Home">
          <Card>
            <CardBody>
              Lorem at HOME ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </nav>
  );
}
