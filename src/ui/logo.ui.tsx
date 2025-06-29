import { CodeXml } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '~/utils';

type LogoProps = {
  className?: string;
  light?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

export const Logo: React.FC<LogoProps> = (props) => {
  const { className, light = false, size = 'md' } = props;

  return (
    <Link to="/" className={cn('inline-flex gap-2 items-center justify-center', size === 'lg' && 'gap-3', className)}>
      <span className="text-olive-600">
        <CodeXml size={size === 'lg' ? '36' : size === 'md' ? '28' : '20'} />
      </span>
      <img
        src={light ? '/logo-light.svg' : '/logo.svg'}
        className={cn('h-6', size === 'lg' && 'h-8', size === 'sm' && 'h-4')}
      />
    </Link>
  );
};
