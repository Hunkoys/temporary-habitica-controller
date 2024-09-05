'use client';

import { Spinner, Tab, Tabs } from '@nextui-org/react';
import { useCallback, useEffect, useState } from 'react';
import { Key } from '@react-types/shared';
import { usePathname, useRouter } from 'next/navigation';

function newRoute<U extends string, D extends string>(url: U, display: D): readonly [U, D] {
  return [url, display] as const;
}

const routeMap = [newRoute('/calendar', 'Calendar'), newRoute('/tasks', 'Tasks'), newRoute('/', 'Home')] as const;

export default function Navbar({ leftie = false }: { leftie?: boolean }) {
  useEffect(() => {
    routeMap.forEach(([url]) => {
      router.prefetch(url);
    });
  }, []);

  const router = useRouter();
  const pathName = usePathname();
  const [to, setTo] = useState<Key>(pathName);
  const [loading, setLoading] = useState(true);
  const selectionChanged = useCallback((key: Key) => {
    if (typeof key !== 'string') return;
    setTo(key);
    router.push(key);
  }, []);

  useEffect(() => {
    if (to !== pathName) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [to, pathName]);

  return (
    <nav className="fixed w-full p-2 bottom-0">
      <Tabs
        aria-label="Navigation Tabs"
        placement={leftie ? 'end' : 'start'}
        color="primary"
        variant="bordered"
        defaultSelectedKey={pathName}
        onSelectionChange={selectionChanged}
      >
        {routeMap.map(([url, display]) => (
          <Tab
            key={url}
            title={
              <span className="relative flex justify-center">
                {display}
                <Spinner
                  className={`absolute transition-opacity opacity-${loading && to === url ? '100' : '0'}`}
                  size="sm"
                  color="white"
                />
              </span>
            }
          />
        ))}
      </Tabs>
    </nav>
  );
}
