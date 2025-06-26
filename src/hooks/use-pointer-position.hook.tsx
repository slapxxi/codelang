import './use-pointer-position.css';
import { useEffect } from 'react';

type Params = { disabled: boolean };

export function usePointerPosition(params?: Params) {
  const { disabled = false } = params || {};

  useEffect(() => {
    if (disabled || document.documentElement.dataset.xy) {
      return;
    }

    document.documentElement.dataset.xy = '';
    document.addEventListener('pointermove', handleMove);

    return () => {
      document.removeEventListener('pointermove', handleMove);
      delete document.documentElement.dataset.xy;
    };

    function handleMove(e: PointerEvent) {
      const docEl = document.documentElement;
      docEl.style.setProperty(
        '--x',
        `${((e.clientX / (document.documentElement.clientWidth / 2) - 1) * 10).toFixed(2)}px`
      );
      docEl.style.setProperty(
        '--y',
        `${((e.clientY / (document.documentElement.clientHeight / 2) - 1) * 10).toFixed(2)}px`
      );
    }
  }, [disabled]);
}
