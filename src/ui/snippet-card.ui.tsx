import type { Snippet } from '~/types';
import ShikiHighlighter from 'react-shiki';
import { Expand, MessageCircle, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { href, Link } from 'react-router';

type SnippetCardProps = {
  snippet: Snippet;
};

export const SnippetCard: React.FC<SnippetCardProps> = (props) => {
  const { snippet } = props;

  return (
    <article className="border border-olive-200 rounded-xl shadow backdrop-blur-[1px] bg-olive-200/30">
      <header className="flex justify-between items-center text-xs text-olive-600 p-2 pb-0">
        <Link to={href('/snippets/:snippetId', { snippetId: snippet.id })}>
          <Expand size={16} />
        </Link>
        <span>{snippet.language}</span>
      </header>

      <pre className="relative m-1 box-border">
        <ShikiHighlighter
          language={snippet.language.toLowerCase()}
          theme="vitesse-dark"
          className="rounded-none *:rounded-sm! absolute! inset-0"
          showLanguage={false}
        >
          {snippet.code}
        </ShikiHighlighter>
        <pre className="bg-black text-zinc-500 rounded p-[20px_24px] overflow-x-auto select-none">{snippet.code}</pre>
      </pre>

      <footer className="flex text-sm text-olive-600 justify-between items-center p-2">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1">
            <ThumbsUp size={16} />
            <span>{snippet.likes}</span>
          </button>
          <button className="flex items-center gap-1">
            <ThumbsDown size={16} />
            <span>{snippet.dislikes}</span>
          </button>
        </div>
        <div className="flex gap-4 items-center">
          {snippet.comments.length > 0 && (
            <Link to={href(`/snippets/:snippetId`, { snippetId: snippet.id })} className="flex items-center gap-1">
              <span>
                <MessageCircle size={16} />
              </span>
              <span>{snippet.comments.length}</span>
            </Link>
          )}
          <Link to={href(`/users/:userId`, { userId: snippet.user.username })} className="flex items-center gap-2">
            <User size={16} />
            {snippet.user.username}
          </Link>
        </div>
      </footer>
    </article>
  );
};
