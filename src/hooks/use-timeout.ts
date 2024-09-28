import { useEffect } from 'react';

export const useTimeout = (callback: () => any, delay: number = 1000, enabled: boolean = true) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (enabled) callback();
    }, delay);

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [callback, delay, enabled]);
};
