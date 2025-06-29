import { Input as BaseInput, ErrorTooltip, ErrorTooltipContent, ErrorTooltipTrigger } from '~/ui/base';
import { cn } from '~/utils';

type InputProps = {
  errors?: string[];
} & React.ComponentProps<typeof BaseInput>;

export const Input: React.FC<InputProps> = (props) => {
  const { errors, className, ...rest } = props;

  if (errors && errors.length > 0) {
    return (
      <ErrorTooltip>
        <ErrorTooltipTrigger asChild>
          <BaseInput className={cn(className, 'border-destructive')} {...rest} />
        </ErrorTooltipTrigger>
        <ErrorTooltipContent side="bottom">
          <ul className="flex flex-col list-disc pl-3">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </ErrorTooltipContent>
      </ErrorTooltip>
    );
  }

  return <BaseInput {...rest} />;
};
