import type { Route } from './+types/home.route';
import { getSnippets } from '~/lib/http';
import { Pagination, SnippetCard } from '~/ui';
import { intoColumns } from '~/utils';

export function meta() {
  return [{ title: 'Codelang' }, { name: 'description', content: 'Codelang' }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page');
  const { data, error } = await getSnippets({ page });

  if (data) {
    const { snippets, totalPages } = data;
    return { snippets, totalPages, currentPage: page ? parseInt(page) : 1 };
  }

  return { error };
}

const HomeRoute = ({ loaderData }: Route.ComponentProps) => {
  const { snippets, totalPages, currentPage, error } = loaderData;

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div>
      <ul className="flex flex-col md:grid grid-cols-2 gap-2.5 grow max-w-[1100px]">
        {intoColumns(snippets, 2).map((col, i) => (
          <div key={i} className="contents md:flex flex-col gap-2.5 pb-12">
            {col.map((s) => (
              <SnippetCard snippet={s} key={s.id} expand />
            ))}
          </div>
        ))}
      </ul>

      <Pagination numberOfPages={totalPages} currentPage={currentPage} maxDisplayed={5} />
    </div>
  );
};

export default HomeRoute;
