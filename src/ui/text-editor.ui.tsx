import { cn } from '~/utils';

type TextEditorProps = React.ComponentProps<'textarea'>;

export const TextEditor: React.FC<TextEditorProps> = (props) => {
  const { className, ...rest } = props;
  return (
    <textarea
      rows={4}
      cols={50}
      className={cn(
        'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        'bg-olive-50/50 backdrop-blur-[2px]',
        className
      )}
      {...rest}
    ></textarea>
  );
};
