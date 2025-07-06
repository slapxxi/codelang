import type { TSnippet, TMark } from '~/types';
import { MessageCircle, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { href, Link, useFetcher } from 'react-router';
import { Code, Card, Button, CardBody, CardFooter, SnippetCardHeader, SnippetCardFooter } from '~/ui';
import { useAuth } from '~/hooks';
import { cn } from '~/utils';
import { useLayoutEffect, useRef, useState } from 'react';
import { SnippetCardBody } from './snippet-card-body.ui';
import { SnippetProvider } from './snippet-card.provider';

type SnippetCardProps = {
  snippet: TSnippet;
  className?: string;
} & React.ComponentProps<typeof Card>;

export const SnippetCard: React.FC<SnippetCardProps> = (props) => {
  const { snippet, className, children, ...rest } = props;
  const [showMore, setShowMore] = useState(false);
  const [expand, setExpand] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const rect = codeRef.current?.getBoundingClientRect();

    if (rect && rect.height >= 300) {
      setShowMore(true);
    }
  });

  return (
    <SnippetProvider value={{ snippet, expand, setExpand, showMore, codeRef }}>
      <Card className={className} {...rest}>
        {children || (
          <>
            <SnippetCardHeader />
            <SnippetCardBody />
            <SnippetCardFooter />
          </>
        )}
      </Card>
    </SnippetProvider>
  );
};
