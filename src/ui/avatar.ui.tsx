import { useId } from 'react';
import { cn } from '~/utils';

type AvatarProps = {
  src?: string;
  className?: string;
};

export const Avatar: React.FC<AvatarProps> = (props) => {
  const { src, className } = props;
  const clipId = useId();

  return (
    <svg viewBox="0 0 40 40" className={cn('size-10', className)}>
      <clipPath id={clipId}>
        <circle cx="20" cy="20" r="20" />
      </clipPath>
      <image href={src ?? '/user.jpg'} className={cn('size-10')} clipPath={`url(#${clipId})`} />
    </svg>
  );
};
