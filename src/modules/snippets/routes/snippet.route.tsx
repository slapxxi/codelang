import type { Route } from './+types/snippet.route';
import { redirect } from 'react-router';
import { getSnippet } from '~/lib/http';
import { SnippetCard } from '~/ui';

export function meta() {
  return [{ title: 'Codelang | Snippets' }, { name: 'description', content: 'Codelang' }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { snippet, error } = await getSnippet({ id: params.snippetId });

  if (error) {
    return redirect('/');
  }

  return { snippet };
}

const SnippetRoute = ({ loaderData }: Route.ComponentProps) => {
  const { snippet } = loaderData;

  return (
    <div className="w-full">
      <SnippetCard snippet={snippet} expand={false} />
    </div>
  );
};

export default SnippetRoute;
