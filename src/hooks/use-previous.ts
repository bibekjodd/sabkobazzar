import { useEffect, useRef } from 'react';

export const usePrevious = <T>(value: T): T | null => {
  const previousRef = useRef<T | null>(null);
  useEffect(() => {
    previousRef.current = value;
  });

  return previousRef.current;
};
