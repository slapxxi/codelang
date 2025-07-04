import type { Route } from './+types/home.route';
import { getSnippets } from '~/lib/http';
import { Pagination, SnippetCard } from '~/ui';
import { intoColumns } from '~/utils';
import { ERROR_TYPE_SERVER, STATUS_SERVER } from '../const';
import { data } from 'react-router';

const HomeRoute = ({ loaderData }: Route.ComponentProps) => {
  const { snippets, totalPages, currentPage } = loaderData;

  return (
    <div>
      <ul className="flex flex-col md:grid grid-cols-2 gap-4 grow max-w-[1100px]">
        {intoColumns(snippets, 2).map((col, i) => (
          <div key={i} className="contents md:flex flex-col gap-4 pb-12">
            {col.map((s) => (
              <SnippetCard snippet={s} key={s.id} expand />
            ))}
          </div>
        ))}
      </ul>

      <Pagination numberOfPages={totalPages} currentPage={currentPage} maxDisplayed={5} className="pb-12" />
    </div>
  );
};

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page');
  const snippetsResult = await getSnippets({ page });

  if (snippetsResult.data) {
    const { snippets, totalPages, currentPage } = snippetsResult.data;
    return { snippets, totalPages, currentPage };
  }

  const { error } = snippetsResult;
  throw data(null, { status: error.type === ERROR_TYPE_SERVER ? error.status : STATUS_SERVER });
}

export function meta() {
  return [{ title: 'Codelang' }, { name: 'description', content: 'Codelang' }];
}

export default HomeRoute;
