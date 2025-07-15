import { Input as BaseInput } from '~/ui/base';
import { cn } from '~/utils';

type InputProps = {
  error?: boolean;
} & React.ComponentProps<typeof BaseInput>;

export const Input: React.FC<InputProps> = (props) => {
  const { error = false, className, ...rest } = props;

  return <BaseInput className={cn(className, error && 'border-destructive')} {...rest} />;
};
