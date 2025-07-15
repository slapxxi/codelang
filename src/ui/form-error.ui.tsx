import { cn } from '~/utils';

type FormErrorsProps = {
  error?: string;
} & React.ComponentProps<'div'>;

export const FormError: React.FC<FormErrorsProps> = (props) => {
  const { error, className, children } = props;

  if (error || children) {
    return (
      <div className={cn('text-destructive', className)}>
        {error && <span>{error}</span>}
        {children}
      </div>
    );
  }

  return null;
};
