import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/utils';

const variants = cva('border border-olive-500/30 rounded-xl shadow break-all', {
  variants: {
    variant: {
      primary: 'bg-olive-200/30 backdrop-blur-px',
      interactive:
        'bg-olive-200/30 backdrop-blur-px hover:backdrop-blur-sm hover:bg-olive-200/50 hover:border-olive-500/20',
      secondary: 'bg-white',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

type CardProps = {
  children?: React.ReactNode;
  className?: string;
  asChild?: boolean;
} & VariantProps<typeof variants> &
  React.ComponentProps<'div'>;

export const Card: React.FC<CardProps> = (props) => {
  const { children, className, variant, asChild = false, ...rest } = props;
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp data-slot="card" className={cn(variants({ variant, className }), className)} {...rest}>
      {children}
    </Comp>
  );
};

export const CardHeader: React.FC<CardProps> = (props) => {
  const { children, className } = props;

  if (!children) {
    return null;
  }

  return <div className={cn('py-2 px-2 text-olive-900', className)}>{children}</div>;
};

export const CardBody: React.FC<CardProps> = (props) => {
  const { children, className } = props;

  if (!children) {
    return null;
  }

  return <div className={cn('px-2', className)}>{children}</div>;
};

export const CardFooter: React.FC<CardProps> = (props) => {
  const { children, className } = props;

  if (!children) {
    return null;
  }

  return <div className={cn('py-2 px-2 text-sm text-olive-900', className)}>{children}</div>;
};
