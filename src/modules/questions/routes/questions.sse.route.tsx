import { getQuestion } from '~/lib/http';
import type { Route } from './+types/questions.sse.route';
import { eventStream } from 'remix-utils/sse/server';

const POLL_RATE = 300;

async function hashString(text: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function loader({ request, params }: Route.LoaderArgs) {
  let prev = '';

  return eventStream(request.signal, function setup(send) {
    async function fn() {
      const questionResult = await getQuestion({ id: params.questionId });

      if (questionResult.data) {
        const answers = questionResult.data.answers;
        const json = JSON.stringify(answers);
        const hash = await hashString(json);

        if (hash !== prev) {
          prev = hash;
          send({ event: 'answers', data: json });
        }
      }
    }

    const timeoutId = setInterval(fn, POLL_RATE);

    return () => void clearTimeout(timeoutId);
  });
}
