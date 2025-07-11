import { useHref, Form } from 'react-router';
import { cn } from '~/utils';

type LoginMessageProps = {} & React.ComponentProps<'div'>;

export const LoginMessage: React.FC<LoginMessageProps> = (props) => {
  const { className, children } = props;
  const currentHref = useHref('');

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Form method="get" action="/login">
        <button name="ref" value={currentHref} className="link">
          Login
        </button>
      </Form>
      {children}
    </div>
  );
};
