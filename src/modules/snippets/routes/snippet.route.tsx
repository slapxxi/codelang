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
    <div className="w-full flex flex-col gap-8 mt-4 md:mt-0 lg:flex-row">
      <SnippetCard
        snippet={snippet}
        expand={false}
        className="lg:w-1/2 max-w-prose lg:sticky top-0 self-center w-full md:flex-1 md:self-start"
      />

      <section className="flex-1 mt-8 md:mt-0 flex flex-col gap-4 max-w-prose mx-auto md:mx-0 w-full">
        <h2 className="font-bold font-mono text-lg text-olive-900 flex gap-2">
          <span>Comments</span>
          <span className="leading-none p-1.5 bg-olive-700 text-white rounded-sm px-2 inline-flex items-center justify-center text-sm">
            {snippet.comments.length}
          </span>
        </h2>

        <ul className="flex flex-col gap-4 pl-2 lg:w-full">
          {snippet.comments.map((comment) => (
            <li key={comment.id} className="bg-gray-50 shadow rounded-lg p-4 border border-gray-200">
              {comment.content}
            </li>
          ))}
          <div className="h-32 shrink-0" />
        </ul>
      </section>
    </div>
  );
};

export default SnippetRoute;
