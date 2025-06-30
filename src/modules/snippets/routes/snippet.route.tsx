import type { Route } from './+types/snippet.route';
import { getSnippet } from '~/lib/http';
import { SnippetCard } from '~/ui';

export function meta() {
  return [{ title: 'Codelang | Snippets' }, { name: 'description', content: 'Codelang' }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { data, error } = await getSnippet({ id: params.snippetId });

  if (data) {
    return { snippet: data.snippet };
  }

  return { error };
}

const SnippetRoute = ({ loaderData }: Route.ComponentProps) => {
  const { snippet, error } = loaderData;

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="w-full">
      <SnippetCard snippet={snippet} expand={false} />
    </div>
  );
};

export default SnippetRoute;
