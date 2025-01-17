import { useEffect } from 'react';

export const useInterval = (cb: () => unknown, interval: number) => {
  useEffect(() => {
    const currentInterval = setInterval(cb, interval);
    return () => clearInterval(currentInterval);
  }, [cb, interval]);
};
