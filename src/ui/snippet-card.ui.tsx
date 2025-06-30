import type { Snippet } from '~/types';
import { Expand, MessageCircle, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { href, Link, useFetcher } from 'react-router';
import { Code } from './code.ui';

type SnippetCardProps = {
  snippet: Snippet;
  expand?: boolean;
};

export const SnippetCard: React.FC<SnippetCardProps> = (props) => {
  const { snippet, expand = false } = props;
  const likeFetcher = useFetcher();
  const dislikeFetcher = useFetcher();

  return (
    <article className="border border-olive-200 rounded-xl shadow backdrop-blur-[1px] bg-olive-200/30">
      <header className="flex justify-between items-center text-xs text-olive-600 p-2 pb-0">
        {expand && (
          <Link to={href('/snippets/:snippetId', { snippetId: snippet.id })}>
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
              className="interactive flex items-center gap-1"
              name="mark"
              value="like"
              disabled={likeFetcher.state !== 'idle'}
            >
              <ThumbsUp size={16} />
              <span>{snippet.likes}</span>
            </button>
          </likeFetcher.Form>

          <dislikeFetcher.Form action={href('/snippets/:snippetId/edit', { snippetId: snippet.id })} method="post">
            <button
              className="flex items-center gap-1 interactive"
              name="mark"
              value="dislike"
              disabled={dislikeFetcher.state !== 'idle'}
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

          <Link to={href(`/users/:userId`, { userId: snippet.user.username })} className="link flex items-center gap-2">
            <User size={16} />
            {snippet.user.username}
          </Link>
        </div>
      </footer>
    </article>
  );
};
