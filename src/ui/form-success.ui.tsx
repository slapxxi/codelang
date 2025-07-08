import { Slot } from '@radix-ui/react-slot';
import { cn } from '~/utils';

type FormSuccessProps = { asChild?: boolean } & React.ComponentProps<'div'>;

export const FormSuccess: React.FC<FormSuccessProps> = (props) => {
  const { asChild, children, className, ...rest } = props;

  if (children) {
    const Comp = asChild ? Slot : 'div';

    return (
      <Comp className={cn('text-success', className)} {...rest}>
        {children}
      </Comp>
    );
  }

  return null;
};
