import type { TSnippet, TMark } from '~/types';
import { Expand, MessageCircle, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { href, Link, useFetcher } from 'react-router';
import { Code, Card, Button, CardHeader, CardBody, CardFooter } from '~/ui';
import { useAuth } from '~/hooks';
import { cn } from '~/utils';
import { useLayoutEffect, useRef, useState } from 'react';

type SnippetCardProps = {
  snippet: TSnippet;
  expand?: boolean;
  className?: string;
};

export const SnippetCard: React.FC<SnippetCardProps> = (props) => {
  const { snippet, expand = false, className } = props;
  const [showMore, setShowMore] = useState(false);
  const [ex, setExpand] = useState(false);
  const likeFetcher = useFetcher();
  const dislikeFetcher = useFetcher();
  const user = useAuth();
  const codeRef = useRef<HTMLDivElement>(null);
  let mark: TMark | undefined;

  if (user) {
    mark = snippet.marks.find((m) => m.user.id === user.id);
  }

  useLayoutEffect(() => {
    const rect = codeRef.current?.getBoundingClientRect();

    if (rect && rect.height >= 300) {
      setShowMore(true);
    }
  });

  function handleClick() {
    setExpand((e) => !e);
  }

  return (
    <Card className={className}>
      <CardHeader className="flex justify-between items-center text-xs text-olive-600">
        {expand && (
          <Link to={href('/snippets/:snippetId', { snippetId: snippet.id })} className="link">
            <Expand size={16} />
          </Link>
        )}
        <span className="ml-auto">{snippet.language}</span>
      </CardHeader>

      <CardBody className="flex flex-col gap-2">
        <Code
          ref={codeRef}
          code={snippet.formattedCode}
          showScrollbar={showMore}
          className={cn('w-full max-w-full min-w-0', ex ? 'max-h-[600px]' : 'max-h-[300px]')}
        />
        {showMore && <Button onClick={handleClick}>Show {ex ? 'less' : 'more'}</Button>}
      </CardBody>

      <CardFooter className="flex text-sm text-olive-600 justify-between items-center">
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
      </CardFooter>
    </Card>
  );
};
