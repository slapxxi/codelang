import { useEffect } from 'react';
import { href, useParams, useRevalidator } from 'react-router';
import { useEventSource } from 'remix-utils/sse/react';
import type { Route } from '../routes/+types/question.route';

export function useAnswerEvents() {
  const params = useParams<Route.ComponentProps['params']>();
  const answer = useEventSource(href('/questions/:questionId/subscribe', { questionId: params.questionId! }), {
    event: 'new-answer',
  });
  const { revalidate } = useRevalidator();

  useEffect(() => {
    revalidate();
  }, [answer]);
}
