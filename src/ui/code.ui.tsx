import { forwardRef } from 'react';
import { cn } from '~/utils';

type CodeProps = {
  code?: string;
  showScrollbar?: boolean;
} & React.ComponentProps<'div'>;

export const Code = forwardRef<HTMLDivElement, CodeProps>((props, ref) => {
  const { code, className, showScrollbar = false, ...rest } = props;

  if (!code) {
    return null;
  }

  return (
    <div
      ref={ref}
      dangerouslySetInnerHTML={{ __html: code }}
      className={cn(
        'flex max-w-full min-w-0 *:w-full *:max-w-full *:min-w-0 *:p-2 *:rounded *:shadow *:overflow-auto',
        showScrollbar && '*:overflow-scroll',
        className
      )}
      {...rest}
    />
  );
});
