import { eventStream } from 'remix-utils/sse/server';
import { emitter } from '~/app/emitter.server';
import type { TComment } from '~/types';
import type { Route } from './+types/snippet-subscribe.route';

export async function loader({ request }: Route.LoaderArgs) {
  return eventStream(request.signal, function setup(send) {
    function handle(comment: TComment) {
      send({ event: 'new-comment', data: comment.id });
    }

    emitter.on('comment', handle);

    return () => {
      emitter.off('comment', handle);
    };
  });
}
