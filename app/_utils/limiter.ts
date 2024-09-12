import { useCallback } from 'react';

export function debounce(cooldown: number, cb: Function) {
  let timeout: NodeJS.Timeout | null;
  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
      timeout = null;
    }, cooldown);
  };
}

export function useDebounce<T>(cooldown: number, cb: Function, deps: T[]) {
  return useCallback(debounce(cooldown, cb), deps);
}

export function throttle(cooldown: number, cb: Function) {
  let timeout: NodeJS.Timeout | null;
  return (...args: any[]) => {
    if (timeout) return;
    cb(...args);
    timeout = setTimeout(() => {
      timeout = null;
    }, cooldown);
  };
}

export function useThrottle<T>(cooldown: number, cb: Function, deps: T[]) {
  return useCallback(throttle(cooldown, cb), deps);
}
