import type { Route } from './+types/home.route';
import { getSnippets } from '~/lib/http';
import { Pagination, SnippetCard } from '~/ui';
import { intoColumns } from '~/utils';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Codelang' }, { name: 'description', content: 'Codelang' }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page');
  const { snippets, totalPages, error } = await getSnippets({ page });
  return { snippets, totalPages, currentPage: page ? parseInt(page) : 1, error };
}

const HomeRoute = ({ loaderData }: Route.ComponentProps) => {
  const { snippets, totalPages, currentPage, error } = loaderData;

  return (
    <div>
      <ul className="flex flex-col md:grid grid-cols-2 gap-2.5 grow max-w-[1100px]">
        {intoColumns(snippets, 2).map((col, i) => (
          <div key={i} className="contents md:flex flex-col gap-2.5 pb-12">
            {col.map((s) => (
              <SnippetCard snippet={s} key={s.id} />
            ))}
          </div>
        ))}
      </ul>

      <Pagination numberOfPages={totalPages} currentPage={currentPage} maxDisplayed={5} />
    </div>
  );
};

export default HomeRoute;
