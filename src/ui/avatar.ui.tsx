import { useId } from 'react';
import { useAuth } from '~/hooks';
import type { TUser } from '~/types';
import { cn } from '~/utils';

type AvatarProps = {
  src?: string;
  className?: string;
  user?: TUser;
};

export const Avatar: React.FC<AvatarProps> = (props) => {
  const { src, className, user } = props;
  const clipId = useId();

  return (
    <svg viewBox="0 0 40 40" className={cn('size-10', className)}>
      <clipPath id={clipId}>
        <circle cx="20" cy="20" r="20" />
      </clipPath>
      <image
        width="40"
        height="40"
        href={user && user.username.toLowerCase().startsWith('giga') ? '/giga.jpg' : (src ?? '/user.jpg')}
        className={cn('size-10')}
        clipPath={`url(#${clipId})`}
        preserveAspectRatio="xMidYMid slice"
      />
    </svg>
  );
};
