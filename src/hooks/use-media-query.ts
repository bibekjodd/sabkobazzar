import { useEffect, useState } from 'react';

export const useMediaQuery = () => {
  const [width, setWidth] = useState(1000);

  const measureWidth = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    measureWidth();
    window.addEventListener('resize', measureWidth);
    return () => {
      window.removeEventListener('resize', measureWidth);
    };
  }, []);

  return width;
};
