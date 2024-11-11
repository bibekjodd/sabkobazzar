import { useEffect, useState } from 'react';

export const usePrevious = <T>(value: T): T | null => {
  const [previous, setPrevious] = useState<T | null>(null);

  useEffect(() => {
    return () => {
      setPrevious(value);
    };
  }, [value]);

  return previous;
};
