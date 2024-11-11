import { useEffect, useState } from 'react';

type WindowSize = { height: number; width: number };
const getWindowSize = (): WindowSize => ({ height: window.innerHeight, width: window.innerWidth });

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    if (typeof window === 'undefined') return { height: 0, width: 0 };
    return getWindowSize();
  });

  const onResize = () => {
    setWindowSize(getWindowSize());
  };

  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return windowSize;
};
