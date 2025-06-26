type LayoutContainerProps = {
  children?: React.ReactNode;
};

// background-image: url('/circle.svg');
// background-size: 30px;
// background-position-x: var(--x);
// background-position-y: var(--y);

export const LayoutContainer: React.FC<LayoutContainerProps> = (props) => {
  const { children } = props;

  return (
    <div className="relative min-h-screen bg-[url('/circle.svg')] bg-position-[var(--x)_var(--y)]">
      {children}

      <img src="/corner.svg" className="absolute top-0 left-0 -z-10 opacity-40 pointer-none" aria-hidden />
      <img src="/corner.svg" className="absolute top-0 right-0 -z-10 rotate-90 opacity-40 pointer-none" aria-hidden />
      <img
        src="/corner.svg"
        className="absolute bottom-0 right-0 -z-10 rotate-180 opacity-40 pointer-none"
        aria-hidden
      />
      <img
        src="/corner.svg"
        className="absolute bottom-0 left-0 -z-10 -rotate-90 opacity-40 pointer-none"
        aria-hidden
      />
    </div>
  );
};
