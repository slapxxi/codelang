import { cn } from '~/utils';

type PageTitleProps = {
  className?: string;
  children?: React.ReactNode;
};

export const PageTitle: React.FC<PageTitleProps> = (props) => {
  const { className, children } = props;

  return (
    <h1 className={cn('text-2xl font-semibold text-zinc-900 font-mono leading-none break-all', className)}>
      {children}
    </h1>
  );
};
