import { useState } from 'react';

export const useLocalStorage = <Value extends string>(key: string, initialValue?: Value) => {
  const [value, setValue] = useState<Value | null>(() => {
    if (localStorage.getItem(key) === null && initialValue) {
      localStorage.setItem(key, initialValue);
    }
    return localStorage.getItem(key) as Value;
  });

  const updateData = (value: Value | null) => {
    if (value === null) {
      setValue(null);
      localStorage.removeItem(key);
      return;
    }
    setValue(value);
    localStorage.setItem(key, value);
  };

  return [value, updateData] as const;
};
