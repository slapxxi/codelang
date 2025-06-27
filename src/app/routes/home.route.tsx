import type { Route } from './+types/home.route.tsx';
import { getSnippets } from '~/lib/http';
import { SnippetCard } from '~/ui';
import { intoColumns } from '~/utils';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Codelang' }, { name: 'description', content: 'Codelang' }];
}

export async function loader() {
  const snippets = await getSnippets();
  return { snippets };
}

const HomeRoute = ({ loaderData }: Route.DataArgs) => {
  const { snippets } = loaderData;

  return (
    <ul className="flex flex-col md:grid grid-cols-2 gap-2.5 grow max-w-[1100px]">
      {intoColumns(snippets, 2).map((col, i) => (
        <div key={i} className="contents md:flex flex-col gap-2.5 pb-12">
          {col.map((s) => (
            <SnippetCard snippet={s} key={s.id} />
          ))}
        </div>
      ))}
    </ul>
  );
};

export default HomeRoute;
