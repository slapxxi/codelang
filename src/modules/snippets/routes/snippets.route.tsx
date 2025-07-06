import { FilePlus } from 'lucide-react';
import { data, href, Link } from 'react-router';
import { ERROR_TYPE_SERVER, STATUS_NOT_FOUND } from '~/app/const';
import { getSnippets } from '~/lib/http';
import type { TSnippet } from '~/types';
import { Button, PageTitle, SnippetCard, SnippetCardBody, SnippetCardFooter, SnippetCardHeader } from '~/ui';
import type { Route } from './+types/snippets.route';

const SnippetsRoute = ({ loaderData }: Route.ComponentProps) => {
  const { snippets } = loaderData;

  return (
    <div className="w-full max-w-prose">
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
    </div>
  );
};

type LoaderResult = {
  snippets?: TSnippet[];
  totalPages?: number;
  currentPage?: number;
};

export async function loader() {
  const result: LoaderResult = { snippets: undefined, totalPages: undefined, currentPage: undefined };
  const snippetsResult = await getSnippets();

  if (snippetsResult.data) {
    const { snippets, totalPages, currentPage } = snippetsResult.data;
    return { ...result, snippets, totalPages, currentPage };
  }

  const { error } = snippetsResult;
  throw data(result, { status: error.type === ERROR_TYPE_SERVER ? error.status : STATUS_NOT_FOUND });
}

export default SnippetsRoute;
