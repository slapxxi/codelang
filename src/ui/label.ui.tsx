import { cn } from '~/utils';

type LabelProps = {} & React.ComponentProps<'label'>;

export const Label: React.FC<LabelProps> = ({ className, ...props }) => {
  return (
    <label
      className={cn(
        'text-sm font-medium leading-none text-zinc-900',
        'hover:text-zinc-600',
        'peer-focus:text-zinc-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  );
};
