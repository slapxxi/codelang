import { forwardRef, Fragment } from 'react';
import { cn } from '~/utils';

type CodeProps = {
  code?: string;
} & React.ComponentProps<'pre'>;

export const Code = forwardRef<HTMLPreElement, CodeProps>((props, ref) => {
  const { code, className, ...rest } = props;

  if (!code) {
    return null;
  }

  return (
    <pre
      ref={ref}
      dangerouslySetInnerHTML={{ __html: code }}
      className={cn('max-w-full min-w-0 *:p-2 *:rounded *:shadow *:overflow-x-auto', className)}
      {...rest}
    />
  );
});
