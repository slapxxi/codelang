import { Expand } from 'lucide-react';
import { href, Link } from 'react-router';
import { CardHeader } from '~/ui';
import { useSnippetContext } from './snippet-card.provider';

type SnippetCardHeaderProps = {
  iconLeft?: React.ReactNode;
};

export const SnippetCardHeader: React.FC<SnippetCardHeaderProps> = (props) => {
  const { iconLeft } = props;
  const ctx = useSnippetContext();

  if (ctx) {
    const { snippet } = ctx;

    return (
      <CardHeader className="flex justify-between items-center text-xs text-olive-600">
        {iconLeft === null
          ? null
          : iconLeft || (
              <Link to={href('/snippets/:snippetId', { snippetId: snippet.id })} className="link">
                <Expand size={16} />
              </Link>
            )}
        <span className="ml-auto">{snippet.language}</span>
      </CardHeader>
    );
  }

  return null;
};
