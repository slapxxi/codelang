import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/utils';

const variants = cva('border border-olive-500/30 rounded-xl shadow', {
  variants: {
    variant: {
      primary: 'bg-olive-200/30 backdrop-blur-px',
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
} & VariantProps<typeof variants>;

export const Card: React.FC<CardProps> = (props) => {
  const { children, className, variant, asChild = false } = props;
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp data-slot="card" className={cn(variants({ variant, className }), className)}>
      {children}
    </Comp>
  );
};

export const CardHeader: React.FC<CardProps> = (props) => {
  const { children, className } = props;

  if (!children) {
    return null;
  }

  return <div className={cn('py-2 px-2', className)}>{children}</div>;
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

  return <div className={cn('py-2 px-2', className)}>{children}</div>;
};
