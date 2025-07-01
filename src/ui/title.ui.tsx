import { cn } from '~/utils';
import * as z from 'zod/v4';

type Level = 1 | 2 | 3 | 4 | 5 | 6;
type h = `h${Level}`;

type TitleProps = {
  level?: Level;
  className?: string;
  children?: React.ReactNode;
  as?: React.ComponentType | React.ElementType;
} & React.ComponentProps<h>;

const HeadingLevelScheme = z.number().min(1).max(6);

export const Title = (props: TitleProps) => {
  const { className, children, level = 1, as, ...rest } = props;
  let HeadingLevel: React.ElementType = 'h1';

  if (!HeadingLevelScheme.safeParse(level).success) {
    HeadingLevel = `h${level}`;
  }

  if (as) {
    HeadingLevel = as;
  }

  return (
    <HeadingLevel
      className={cn(
        'font-semibold text-olive-800 font-mono',
        level === 1 && 'text-2xl',
        level === 2 && 'text-xl',
        level === 3 && 'text-lg',
        level === 4 && 'text-base',
        level === 5 && 'text-sm',
        level === 6 && 'text-xs',
        className
      )}
      {...rest}
    >
      {children}
    </HeadingLevel>
  );
};
