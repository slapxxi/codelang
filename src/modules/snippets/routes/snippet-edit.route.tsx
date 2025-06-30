import type { Route } from './+types/snippet-edit.route';

export async function loader({ params }: Route.LoaderArgs) {
  return { snippetId: params.snippetId };
}
