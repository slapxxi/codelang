import { forwardRef } from 'react';

type LayoutContainerProps = {
  children?: React.ReactNode;
};

export const LayoutContainer = forwardRef<HTMLDivElement, LayoutContainerProps>((props, ref) => {
  const { children } = props;

  return (
    <div
      className="relative min-h-screen bg-[url('/circle.svg')] bg-position-[var(--x)_var(--y)] overflow-hidden"
      ref={ref}
    >
      {children}

      <img
        src="/corner.svg"
        className="pointer-events-none fixed top-0 left-0 z-0 opacity-40 pointer-none"
        aria-hidden
      />
      <img
        src="/corner.svg"
        className="pointer-events-none fixed top-0 right-0 -z-0 rotate-90 opacity-40"
        aria-hidden
      />
      <img
        src="/corner.svg"
        className="pointer-events-none fixed bottom-0 right-0 z-0 rotate-180 opacity-40"
        aria-hidden
      />
      <img
        src="/corner.svg"
        className="pointer-events-none fixed bottom-0 left-0 z-0 -rotate-90 opacity-40"
        aria-hidden
      />
    </div>
  );
});
