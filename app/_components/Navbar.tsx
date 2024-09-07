'use client';

import { Spinner, Tab, Tabs } from '@nextui-org/react';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { Key } from '@react-types/shared';
import { usePathname, useRouter } from 'next/navigation';
// import clsx from 'clsx';

function newRoute<
  U extends string,
  D extends string,
  I extends ({ size, color }: { size: number; color: string }) => ReactElement
>(url: U, display: D, icon: I): readonly [U, D, I] {
  return [url, display, icon] as const;
}

const iconClassName = (color: string) => {
  return `${color} transition-all duration-1000 ease-[cubic-bezier(.17,1.09,.45,.95)]`;
};
const routeMap = [
  newRoute('/', 'List', ({ size, color }) => (
    <svg width={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.33333 0C3.91885 0 2.56229 0.561903 1.5621 1.5621C0.561903 2.56229 0 3.91885 0 5.33333V26.6667C0 28.0812 0.561903 29.4377 1.5621 30.4379C2.56229 31.4381 3.91885 32 5.33333 32H26.6667C28.0812 32 29.4377 31.4381 30.4379 30.4379C31.4381 29.4377 32 28.0812 32 26.6667V5.33333C32 3.91885 31.4381 2.56229 30.4379 1.5621C29.4377 0.561903 28.0812 0 26.6667 0H5.33333ZM12.4444 8.88889C12.4444 8.41739 12.6317 7.96521 12.9651 7.63181C13.2985 7.29841 13.7507 7.11111 14.2222 7.11111H24.8889C25.3604 7.11111 25.8126 7.29841 26.146 7.63181C26.4794 7.96521 26.6667 8.41739 26.6667 8.88889C26.6667 9.36038 26.4794 9.81257 26.146 10.146C25.8126 10.4794 25.3604 10.6667 24.8889 10.6667H14.2222C13.7507 10.6667 13.2985 10.4794 12.9651 10.146C12.6317 9.81257 12.4444 9.36038 12.4444 8.88889ZM12.4444 16C12.4444 15.5285 12.6317 15.0763 12.9651 14.7429C13.2985 14.4095 13.7507 14.2222 14.2222 14.2222H24.8889C25.3604 14.2222 25.8126 14.4095 26.146 14.7429C26.4794 15.0763 26.6667 15.5285 26.6667 16C26.6667 16.4715 26.4794 16.9237 26.146 17.2571C25.8126 17.5905 25.3604 17.7778 24.8889 17.7778H14.2222C13.7507 17.7778 13.2985 17.5905 12.9651 17.2571C12.6317 16.9237 12.4444 16.4715 12.4444 16ZM12.4444 23.1111C12.4444 22.6396 12.6317 22.1874 12.9651 21.854C13.2985 21.5206 13.7507 21.3333 14.2222 21.3333H24.8889C25.3604 21.3333 25.8126 21.5206 26.146 21.854C26.4794 22.1874 26.6667 22.6396 26.6667 23.1111C26.6667 23.5826 26.4794 24.0348 26.146 24.3682C25.8126 24.7016 25.3604 24.8889 24.8889 24.8889H14.2222C13.7507 24.8889 13.2985 24.7016 12.9651 24.3682C12.6317 24.0348 12.4444 23.5826 12.4444 23.1111ZM7.11111 7.11111C6.63962 7.11111 6.18743 7.29841 5.85403 7.63181C5.52063 7.96521 5.33333 8.41739 5.33333 8.88889C5.33333 9.36038 5.52063 9.81257 5.85403 10.146C6.18743 10.4794 6.63962 10.6667 7.11111 10.6667C7.58261 10.6667 8.03657 10.4794 8.36997 10.146C8.70337 9.81257 8.89067 9.36038 8.89067 8.88889C8.89067 8.41739 8.70337 7.96521 8.36997 7.63181C8.03657 7.29841 7.58261 7.11111 7.11111 7.11111ZM5.33333 16C5.33333 15.5285 5.52063 15.0763 5.85403 14.7429C6.18743 14.4095 6.63962 14.2222 7.11111 14.2222C7.58261 14.2222 8.03657 14.4095 8.36997 14.7429C8.70337 15.0763 8.89067 15.5285 8.89067 16C8.89067 16.4715 8.70337 16.9237 8.36997 17.2571C8.03657 17.5905 7.58438 17.7778 7.11289 17.7778C6.64139 17.7778 6.18743 17.5905 5.85403 17.2571C5.52063 16.9237 5.33333 16.4715 5.33333 16ZM7.11111 21.3333C6.63962 21.3333 6.18743 21.5206 5.85403 21.854C5.52063 22.1874 5.33333 22.6396 5.33333 23.1111C5.33333 23.5826 5.52063 24.0348 5.85403 24.3682C6.18743 24.7016 6.63962 24.8889 7.11111 24.8889C7.58261 24.8889 8.03657 24.7016 8.36997 24.3682C8.70337 24.0348 8.89067 23.5826 8.89067 23.1111C8.89067 22.6396 8.70337 22.1874 8.36997 21.854C8.03657 21.5206 7.58261 21.3333 7.11111 21.3333Z"
        className={iconClassName(color)}
      />
    </svg>
  )),
  newRoute('/schedule', 'Schedule', ({ size, color }) => (
    <svg width={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.71429 0C4.19876 0 2.74531 0.602039 1.67368 1.67368C0.602039 2.74531 0 4.19876 0 5.71429V6.85714H32V5.71429C32 4.19876 31.398 2.74531 30.3263 1.67368C29.2547 0.602039 27.8012 0 26.2857 0H5.71429ZM32 9.14286H0V26.2857C0 27.8012 0.602039 29.2547 1.67368 30.3263C2.74531 31.398 4.19876 32 5.71429 32H26.2857C27.8012 32 29.2547 31.398 30.3263 30.3263C31.398 29.2547 32 27.8012 32 26.2857V9.14286ZM11.4286 16C11.4286 16.6062 11.1878 17.1876 10.7591 17.6162C10.3304 18.0449 9.74907 18.2857 9.14286 18.2857C8.53665 18.2857 7.95527 18.0449 7.52661 17.6162C7.09796 17.1876 6.85714 16.6062 6.85714 16C6.85714 15.3938 7.09796 14.8124 7.52661 14.3838C7.95527 13.9551 8.53665 13.7143 9.14286 13.7143C9.74907 13.7143 10.3304 13.9551 10.7591 14.3838C11.1878 14.8124 11.4286 15.3938 11.4286 16ZM9.14286 25.1429C8.53665 25.1429 7.95527 24.902 7.52661 24.4734C7.09796 24.0447 6.85714 23.4634 6.85714 22.8571C6.85714 22.2509 7.09796 21.6696 7.52661 21.2409C7.95527 20.8122 8.53665 20.5714 9.14286 20.5714C9.74907 20.5714 10.3304 20.8122 10.7591 21.2409C11.1878 21.6696 11.4286 22.2509 11.4286 22.8571C11.4286 23.4634 11.1878 24.0447 10.7591 24.4734C10.3304 24.902 9.74907 25.1429 9.14286 25.1429ZM18.2857 16C18.2857 16.6062 18.0449 17.1876 17.6162 17.6162C17.1876 18.0449 16.6062 18.2857 16 18.2857C15.3938 18.2857 14.8124 18.0449 14.3838 17.6162C13.9551 17.1876 13.7143 16.6062 13.7143 16C13.7143 15.3938 13.9551 14.8124 14.3838 14.3838C14.8124 13.9551 15.3938 13.7143 16 13.7143C16.6062 13.7143 17.1876 13.9551 17.6162 14.3838C18.0449 14.8124 18.2857 15.3938 18.2857 16ZM16 25.1429C15.3938 25.1429 14.8124 24.902 14.3838 24.4734C13.9551 24.0447 13.7143 23.4634 13.7143 22.8571C13.7143 22.2509 13.9551 21.6696 14.3838 21.2409C14.8124 20.8122 15.3938 20.5714 16 20.5714C16.6062 20.5714 17.1876 20.8122 17.6162 21.2409C18.0449 21.6696 18.2857 22.2509 18.2857 22.8571C18.2857 23.4634 18.0449 24.0447 17.6162 24.4734C17.1876 24.902 16.6062 25.1429 16 25.1429ZM25.1429 16C25.1429 16.6062 24.902 17.1876 24.4734 17.6162C24.0447 18.0449 23.4634 18.2857 22.8571 18.2857C22.2509 18.2857 21.6696 18.0449 21.2409 17.6162C20.8122 17.1876 20.5714 16.6062 20.5714 16C20.5714 15.3938 20.8122 14.8124 21.2409 14.3838C21.6696 13.9551 22.2509 13.7143 22.8571 13.7143C23.4634 13.7143 24.0447 13.9551 24.4734 14.3838C24.902 14.8124 25.1429 15.3938 25.1429 16Z"
        className={iconClassName(color)}
      />
    </svg>
  )),
  newRoute('/shortcuts', 'Shortcuts', ({ size, color }) => (
    <svg height={size} viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M27.6921 20.7693V27.6923C27.6921 28.3044 27.4489 28.8913 27.0162 29.3241C26.5834 29.7569 25.9964 30 25.3844 30H2.30767C1.69564 30 1.10867 29.7569 0.675901 29.3241C0.243129 28.8913 0 28.3044 0 27.6923V20.7693C0 20.1573 0.243129 19.5703 0.675901 19.1375C1.10867 18.7048 1.69564 18.4616 2.30767 18.4616H12.6922V11.4218C11.2914 11.1359 10.0467 10.34 9.19931 9.18845C8.35196 8.03692 7.96237 6.61178 8.10607 5.18933C8.24976 3.76687 8.91651 2.44845 9.97704 1.48965C11.0376 0.530857 12.4163 0 13.846 0C15.2757 0 16.6545 0.530857 17.715 1.48965C18.7756 2.44845 19.4423 3.76687 19.586 5.18933C19.7297 6.61178 19.3401 8.03692 18.4928 9.18845C17.6454 10.34 16.4007 11.1359 14.9999 11.4218V18.4616H25.3844C25.9964 18.4616 26.5834 18.7048 27.0162 19.1375C27.4489 19.5703 27.6921 20.1573 27.6921 20.7693ZM18.4614 15.0001C18.4614 15.3061 18.5829 15.5996 18.7993 15.816C19.0157 16.0324 19.3092 16.154 19.6152 16.154H24.2306C24.5366 16.154 24.8301 16.0324 25.0464 15.816C25.2628 15.5996 25.3844 15.3061 25.3844 15.0001C25.3844 14.6941 25.2628 14.4006 25.0464 14.1842C24.8301 13.9679 24.5366 13.8463 24.2306 13.8463H19.6152C19.3092 13.8463 19.0157 13.9679 18.7993 14.1842C18.5829 14.4006 18.4614 14.6941 18.4614 15.0001Z"
        className={iconClassName(color)}
      />
    </svg>
  )),
] as const;

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
    router.push(key, { scroll: false });
  }, []);

  useEffect(() => {
    if (to !== pathName) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [to, pathName]);

  return (
    <nav className="w-full mb-3 p-2 flex justify-evenly">
      <Tabs
        fullWidth
        aria-label="Navigation Tabs"
        placement="bottom"
        variant="bordered"
        defaultSelectedKey={pathName}
        onSelectionChange={selectionChanged}
      >
        {routeMap.map(([url, display, Icon]) => (
          <Tab
            className="transition-all"
            key={url}
            title={
              <div className="relative flex w-fit sm:w-full justify-center items-center gap-1 transition-all">
                {<Icon size={24} color={to === url ? 'fill-primary' : 'fill-white'} />}
                <span
                  className={`truncate w-0 sm:w-full transition-all duration-1000 text-lg text-${
                    to === url ? 'primary' : 'white'
                  }`}
                >
                  {display}
                </span>
                <Spinner
                  className={`absolute transition-opacity opacity-${loading && to === url ? '100' : '0'}`}
                  size="sm"
                  color="white"
                />
              </div>
            }
          />
        ))}
      </Tabs>
      {/* <div id="space-for-page's-action-button" className="h-full w-32"></div> */}
    </nav>
  );
}
