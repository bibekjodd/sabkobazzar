import { useEffect } from 'react';

export const useTimeout = (
  callback: () => unknown,
  delay: number = 1000,
  enabled: boolean = true
) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (enabled) callback();
    }, delay);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [callback, delay, enabled]);
};
