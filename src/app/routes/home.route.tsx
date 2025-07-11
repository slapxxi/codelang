import { data } from 'react-router';
import { ERROR_TYPE_SERVER, STATUS_CODES } from '~/app/const';
import { getSnippets } from '~/lib/http';
import { Pagination, SnippetCard } from '~/ui';
import { intoColumns } from '~/utils';
import type { Route } from './+types/home.route';
import type { DataWithResponseInit, TSnippet } from '~/types';

const HomeRoute = ({ loaderData }: Route.ComponentProps) => {
  const { snippets, totalPages, currentPage } = loaderData;

  return (
    <div>
      <ul className="flex max-w-[1100px] grow grid-cols-2 flex-col gap-4 md:grid">
        {intoColumns(snippets, 2).map((col, i) => (
          <div key={i} className="contents flex-col gap-4 pb-12 md:flex">
            {col.map((s) => (
              <SnippetCard snippet={s} key={s.id} />
            ))}
          </div>
        ))}
      </ul>

      <Pagination numberOfPages={totalPages} currentPage={currentPage} maxDisplayed={5} className="pb-12" />
    </div>
  );
};

type LoaderResult = {
  snippets: TSnippet[];
  totalPages: number;
  currentPage: number;
};

export async function loader({
  request,
}: Route.LoaderArgs): Promise<LoaderResult | DataWithResponseInit<LoaderResult>> {
  const url = new URL(request.url);
  const page = url.searchParams.get('page');
  const snippetsResult = await getSnippets({ page });

  if (snippetsResult.data) {
    const { snippets, totalPages, currentPage } = snippetsResult.data;
    return data({ snippets, totalPages, currentPage });
  }

  const { error } = snippetsResult;
  throw data(null, { status: error.type === ERROR_TYPE_SERVER ? error.status : STATUS_CODES.SERVER });
}

export function meta() {
  return [{ title: 'Codelang | Home' }, { name: 'description', content: 'Codelang' }];
}

export default HomeRoute;
