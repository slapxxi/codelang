import { useEffect, useRef } from 'react';
import './use-pointer-position.css';

type Params = { disabled: boolean };

export function usePointerPosition<T extends HTMLElement>(params?: Params) {
  const { disabled = false } = params || {};
  const ref = useRef<T>(null);

  useEffect(() => {
    if (disabled) {
      return;
    }

    document.addEventListener('pointermove', handleMove);

    return () => {
      document.removeEventListener('pointermove', handleMove);
    };

    function handleMove(e: PointerEvent) {
      const el = ref.current as HTMLElement;
      if (el) {
        el.style.setProperty(
          '--x',
          `${((e.clientX / (document.documentElement.clientWidth / 2) - 1) * 10).toFixed(2)}px`
        );
        el.style.setProperty(
          '--y',
          `${((e.clientY / (document.documentElement.clientHeight / 2) - 1) * 10).toFixed(2)}px`
        );
      }
    }
  }, [disabled]);

  return ref;
}
