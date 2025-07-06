import { FilePlus } from 'lucide-react';
import { data, href, Link } from 'react-router';
import { ERROR_TYPE_SERVER, STATUS_NOT_FOUND } from '~/app/const';
import { getSnippets } from '~/lib/http';
import {
  Button,
  PageTitle,
  Pagination,
  SnippetCard,
  SnippetCardBody,
  SnippetCardFooter,
  SnippetCardHeader,
} from '~/ui';
import type { Route } from './+types/snippets.route';

const SnippetsRoute = ({ loaderData }: Route.ComponentProps) => {
  const { snippets, totalPages, currentPage } = loaderData;

  return (
    <div className="w-full max-w-prose flex flex-col gap-4">
      <PageTitle className="flex gap-4 items-center mb-4">
        Snippets
        <Button asChild>
          <Link to={href('/snippets/new')}>
            <FilePlus size={16} />
            <span>New Snippet</span>
          </Link>
        </Button>
      </PageTitle>

      <ul className="flex flex-col gap-2">
        {snippets.map((s) => (
          <SnippetCard asChild snippet={s} key={s.id}>
            <li>
              <SnippetCardHeader />
              <SnippetCardBody />
              <SnippetCardFooter />
            </li>
          </SnippetCard>
        ))}
      </ul>

      <Pagination numberOfPages={totalPages} currentPage={currentPage} maxDisplayed={5} className="pt-4 pb-8" />
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
  throw data(null, { status: error.type === ERROR_TYPE_SERVER ? error.status : STATUS_NOT_FOUND });
}

export default SnippetsRoute;
