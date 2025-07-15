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

  const likeMark = likeFetcher.formData?.get('mark');
  const dislikeMark = dislikeFetcher.formData?.get('mark');

  let mark: TMark | undefined;

  if (ctx) {
    const { snippet } = ctx;
    let optimisticLikes = snippet.likes;
    let optimisticDislikes = snippet.dislikes;

    if (user) {
      mark = snippet.marks.find((m) => m.user.id === user.id);

      optimisticLikes =
        snippet.likes +
        (likeMark === 'like' ? 1 : likeMark === 'none' ? -1 : 0) +
        (dislikeMark === 'dislike' && mark?.type === 'like' ? -1 : 0);

      optimisticDislikes =
        snippet.dislikes +
        (dislikeMark === 'dislike' ? 1 : dislikeMark === 'none' ? -1 : 0) +
        (likeMark === 'like' && mark?.type === 'dislike' ? -1 : 0);
    }

    return (
      <CardFooter className="flex items-center justify-between text-sm text-olive-600">
        <div className="flex items-center gap-3">
          <likeFetcher.Form action={href('/snippets/:snippetId/edit', { snippetId: snippet.id })} method="post">
            <button
              name="mark"
              value={mark && mark.type === 'like' ? 'none' : 'like'}
              disabled={likeFetcher.state !== 'idle' || dislikeFetcher.state !== 'idle'}
              className={cn(
                (mark?.type === 'like' && dislikeMark !== 'dislike' && likeMark !== 'none') || likeMark === 'like'
                  ? 'text-lime-600 hover:text-lime-700'
                  : '',
                'interactive flex items-center gap-1'
              )}
            >
              <ThumbsUp size={16} />
              <span>{optimisticLikes}</span>
            </button>
          </likeFetcher.Form>

          <dislikeFetcher.Form action={href('/snippets/:snippetId/edit', { snippetId: snippet.id })} method="post">
            <button
              name="mark"
              value={mark?.type === 'dislike' ? 'none' : 'dislike'}
              disabled={dislikeFetcher.state !== 'idle' || likeFetcher.state !== 'idle'}
              className={cn(
                (mark?.type === 'dislike' && likeMark !== 'like' && dislikeMark !== 'none') || dislikeMark === 'dislike'
                  ? 'text-red-600 hover:text-red-700'
                  : '',
                'interactive flex items-center gap-1'
              )}
            >
              <ThumbsDown size={16} />
              <span>{optimisticDislikes}</span>
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
