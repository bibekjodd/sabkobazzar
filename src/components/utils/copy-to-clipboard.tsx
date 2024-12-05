import React, { useEffect, useRef, useState } from 'react';

type State = 'ready' | 'success' | 'error';
type Props = {
  children: (args: { state: State; copy: (val: string) => void }) => React.ReactNode;
  delay?: number;
  onSuccess?: () => unknown;
  onError?: (error: string) => unknown;
};
export default function CopyToClipboard({
  children: Children,
  delay = 2000,
  onSuccess,
  onError
}: Props) {
  const [state, setState] = useState<State>('ready');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = (value: string) => {
    if (!('clipboard' in navigator) || state !== 'ready') return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setState('success');
        if (onSuccess) onSuccess();
        timeoutRef.current = setTimeout(() => {
          setState('ready');
        }, delay);
      })
      .catch((err) => {
        setState('error');
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        if (onError) onError(errorMessage);
        timeoutRef.current = setTimeout(() => {
          setState('error');
        }, delay);
      });
  };

  return <Children state={state} copy={copy} />;
}
