type LayoutContainerProps = {
  children?: React.ReactNode;
};

export const LayoutContainer: React.FC<LayoutContainerProps> = (props) => {
  const { children } = props;

  return (
    <div className="relative min-h-screen bg-[url('/circle.svg')] bg-position-[var(--x)_var(--y)]">
      {children}

      <img
        src="/corner.svg"
        className="pointer-events-none absolute top-0 left-0 z-0 opacity-40 pointer-none"
        aria-hidden
      />
      <img
        src="/corner.svg"
        className="pointer-events-none absolute top-0 right-0 -z-0 rotate-90 opacity-40"
        aria-hidden
      />
      <img
        src="/corner.svg"
        className="pointer-events-none absolute bottom-0 right-0 z-0 rotate-180 opacity-40"
        aria-hidden
      />
      <img
        src="/corner.svg"
        className="pointer-events-none absolute bottom-0 left-0 z-0 -rotate-90 opacity-40"
        aria-hidden
      />
    </div>
  );
};
