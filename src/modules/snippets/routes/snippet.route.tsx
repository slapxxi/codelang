import { redirect } from 'react-router';
import type { Route } from './+types/snippet.route';
import { getSnippet } from '~/lib/http';
import { SnippetCard } from '~/ui';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Codelang' }, { name: 'description', content: 'Codelang' }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { snippet, error } = await getSnippet({ id: params.snippetId });

  if (error) {
    return redirect('/');
  }

  return { snippet };
}

const SnippetRoute = ({ loaderData }: Route.DataArgs) => {
  const { snippet } = loaderData;

  return (
    <div className="w-full">
      <SnippetCard snippet={snippet} />
    </div>
  );
};

export default SnippetRoute;
