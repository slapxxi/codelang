import { MessageCircle, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { href, Link, useFetcher } from 'react-router';
import { CardFooter } from '~/ui';
import { useSnippetContext } from './snippet-card.provider';
import { cn } from '~/utils';
import { useAuth } from '~/hooks';
import type { TMark } from '~/types';

export const SnippetCardFooter: React.FC = () => {
  const ctx = useSnippetContext();
  const likeFetcher = useFetcher();
  const dislikeFetcher = useFetcher();
  const user = useAuth();

  let mark: TMark | undefined;

  if (ctx) {
    const { snippet } = ctx;

    if (user) {
      mark = snippet.marks.find((m) => m.user.id === user.id);
    }

    return (
      <CardFooter className="flex items-center justify-between text-sm text-olive-600">
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

        <div className="flex items-center gap-4">
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
      </CardFooter>
    );
  }

  return null;
};
