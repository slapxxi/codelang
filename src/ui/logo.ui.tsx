import { CodeXml } from 'lucide-react';
import { Link } from 'react-router';

export const Logo = () => {
  return (
    <Link to="/" className="absolute bottom-0 right-0 flex gap-1.5 p-4 items-center justify-center">
      <span className="text-olive-500">
        <CodeXml />
      </span>
      <img src="/logo.svg" />
    </Link>
  );
};
