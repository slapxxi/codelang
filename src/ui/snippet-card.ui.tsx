import type { Snippet, TMark } from '~/types';
import { Expand, MessageCircle, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { href, Link, useFetcher } from 'react-router';
import { Code } from './code.ui';
import { useAuth } from '~/hooks';
import { cn } from '~/utils';

type SnippetCardProps = {
  snippet: Snippet;
  expand?: boolean;
  className?: string;
};

export const SnippetCard: React.FC<SnippetCardProps> = (props) => {
  const { snippet, expand = false, className } = props;
  const likeFetcher = useFetcher();
  const dislikeFetcher = useFetcher();
  const user = useAuth();
  let mark: TMark | undefined;

  if (user) {
    mark = snippet.marks.find((m) => m.user.id === user.id);
  }

  return (
    <article className={cn('border border-olive-200 rounded-xl shadow backdrop-blur-[1px] bg-olive-200/30', className)}>
      <header className="flex justify-between items-center text-xs text-olive-600 p-2 pb-0">
        {expand && (
          <Link to={href('/snippets/:snippetId', { snippetId: snippet.id })} className="link">
            <Expand size={16} />
          </Link>
        )}
        <span className="ml-auto">{snippet.language}</span>
      </header>

      <pre className="relative m-1 my-2">
        <Code code={snippet.code} />
      </pre>

      <footer className="flex text-sm text-olive-600 justify-between items-center p-2">
        <div className="flex items-center gap-3">
          <likeFetcher.Form action={href('/snippets/:snippetId/edit', { snippetId: snippet.id })} method="post">
            <button
              name="mark"
              value={mark && mark.type === 'like' ? 'none' : 'like'}
              disabled={likeFetcher.state !== 'idle'}
              className={cn(
                mark && mark.type === 'like' ? 'text-lime-600 hover:text-lime-700' : '',
                'interactive flex items-center gap-1'
              )}
            >
              <ThumbsUp size={16} />
              <span>{snippet.likes}</span>
            </button>
          </likeFetcher.Form>

          <dislikeFetcher.Form action={href('/snippets/:snippetId/edit', { snippetId: snippet.id })} method="post">
            <button
              name="mark"
              value={mark && mark.type === 'dislike' ? 'none' : 'dislike'}
              disabled={dislikeFetcher.state !== 'idle'}
              className={cn(
                mark && mark.type === 'dislike' ? 'text-red-600 hover:text-red-700' : '',
                'interactive flex items-center gap-1'
              )}
            >
              <ThumbsDown size={16} />
              <span>{snippet.dislikes}</span>
            </button>
          </dislikeFetcher.Form>
        </div>

        <div className="flex gap-4 items-center">
          {snippet.comments.length > 0 && (
            <Link to={href(`/snippets/:snippetId`, { snippetId: snippet.id })} className="link flex items-center gap-1">
              <span>
                <MessageCircle size={16} />
              </span>
              <span>{snippet.comments.length}</span>
            </Link>
          )}

          <Link to={href(`/users/:userId`, { userId: snippet.user.id })} className="link flex items-center gap-2">
            <User size={16} />
            {snippet.user.username}
          </Link>
        </div>
      </footer>
    </article>
  );
};
