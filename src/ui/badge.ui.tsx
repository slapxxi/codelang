import { cn } from '~/utils';

type BadgeProps = {} & React.ComponentProps<'span'>;

export const Badge: React.FC<BadgeProps> = (props) => {
  const { className, children } = props;

  return (
    <span
      className={cn(
        'leading-none p-1.5 bg-olive-700 text-white rounded-sm px-2 inline-flex items-center justify-center text-sm',
        className
      )}
    >
      {children}
    </span>
  );
};
