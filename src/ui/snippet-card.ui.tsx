import type { Snippet } from '~/types';
import ShikiHighlighter from 'react-shiki';
import { ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { Link } from 'react-router';

type SnippetCardProps = {
  snippet: Snippet;
};

export const SnippetCard: React.FC<SnippetCardProps> = (props) => {
  const { snippet } = props;

  return (
    <div className="border border-olive-200 rounded-xl shadow backdrop-blur-[1px] bg-olive-200/30">
      <span className="p-2 pb-0 text-xs flex justify-end text-olive-600 select-none">{snippet.language}</span>

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

      <div className="flex text-sm text-olive-600 justify-between p-2">
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
        <Link to={`/users/${snippet.user.username}`} className="flex items-center gap-2">
          <User size={16} />
          {snippet.user.username}
        </Link>
      </div>
    </div>
  );
};
