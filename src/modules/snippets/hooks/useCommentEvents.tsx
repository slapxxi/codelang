import { useEffect } from 'react';
import { href, useParams, useRevalidator } from 'react-router';
import { useEventSource } from 'remix-utils/sse/react';
import type { Route } from '../routes/+types/snippet.route';

export function useCommentEvents() {
  const params = useParams<Route.ComponentProps['params']>();
  const comment = useEventSource(href('/snippets/:snippetId/subscribe', { snippetId: params.snippetId! }), {
    event: 'new-comment',
  });
  const { revalidate } = useRevalidator();

  useEffect(() => {
    revalidate();
  }, [comment]);
}
