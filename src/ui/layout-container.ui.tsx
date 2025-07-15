import { usePointerPosition } from '~/hooks';
import { cn } from '~/utils';

type LayoutContainerProps = {
  className?: string;
  children?: React.ReactNode;
  disableMotion?: boolean;
};

export const LayoutContainer: React.FC<LayoutContainerProps> = (props) => {
  const { children, className, disableMotion = false } = props;
  const ref = usePointerPosition<HTMLDivElement>({ disabled: disableMotion });

  return (
    <div
      ref={ref}
      className={cn("relative min-h-screen bg-[url('/circle.svg')] bg-position-[var(--x)_var(--y)]", className)}
    >
      {children}

      <img
        src="/corner.svg"
        className="pointer-none pointer-events-none fixed top-0 left-0 z-0 opacity-40"
        aria-hidden
      />
      <img
        src="/corner.svg"
        className="pointer-events-none fixed top-0 right-0 -z-0 rotate-90 opacity-40"
        aria-hidden
      />
      <img
        src="/corner.svg"
        className="pointer-events-none fixed right-0 bottom-0 z-0 rotate-180 opacity-40"
        aria-hidden
      />
      <img
        src="/corner.svg"
        className="pointer-events-none fixed bottom-0 left-0 z-0 -rotate-90 opacity-40"
        aria-hidden
      />
    </div>
  );
};
