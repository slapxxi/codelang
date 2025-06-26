import { CodeXml } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '~/utils';

type LogoProps = {
  className?: string;
  light?: boolean;
};

export const Logo: React.FC<LogoProps> = (props) => {
  const { className, light = false } = props;

  return (
    <Link to="/" className={cn('inline-flex gap-2 items-center justify-center', className)}>
      <span className="text-olive-600">
        <CodeXml />
      </span>
      <img src={light ? '/logo-light.svg' : '/logo.svg'} />
    </Link>
  );
};
