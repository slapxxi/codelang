import { eventStream } from 'remix-utils/sse/server';
import { emitter } from '~/app/emitter.server';
import type { TAnswer } from '~/types';
import type { Route } from './+types/question-subscribe.route';

export async function loader({ request }: Route.LoaderArgs) {
  return eventStream(request.signal, function setup(send) {
    function handle(answer: TAnswer) {
      send({ event: 'new-answer', data: answer.id });
    }

    emitter.on('answer', handle);

    return () => {
      emitter.off('answer', handle);
    };
  });
}
