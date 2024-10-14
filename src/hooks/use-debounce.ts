import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, delay = 250): T => {
  const [debouncedValue, setDetouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDetouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
};
