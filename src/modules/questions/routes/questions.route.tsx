import { FilePlus } from 'lucide-react';
import type { Route } from './+types/questions.route.tsx';
import { data, href, Link } from 'react-router';
import { STATUS_SERVER } from '~/app/const/status-codes.js';
import { useAuth } from '~/hooks/use-auth.hook.js';
import { getQuestions } from '~/lib/http';
import { PageTitle, Pagination } from '~/ui';

const QuestionsRoute = ({ loaderData }: Route.ComponentProps) => {
  const { questions, totalPages, currentPage } = loaderData;
  const user = useAuth();

  return (
    <section className="flex flex-col">
      <header className="flex gap-2 items-center mb-4">
        <PageTitle> Questions </PageTitle>
        {user && (
          <Link
            to={href('/questions/new')}
            className="inline-flex gap-2 items-center border rounded-lg border-olive-300 bg-olive-300 p-2 hover:bg-olive-400 leading-none"
          >
            New Question <FilePlus size={16} />
          </Link>
        )}
      </header>

      <ul className="flex flex-col gap-2">
        {questions!.map((q) => (
          <li key={q.id}>
            <Link
              to={href('/questions/:questionId', { questionId: q.id })}
              className="inline-flex p-2 bg-olive-100 shadow rounded hover:bg-olive-200"
            >
              {q.title}
            </Link>
          </li>
        ))}
      </ul>

      <Pagination numberOfPages={totalPages!} currentPage={currentPage} maxDisplayed={10} />
    </section>
  );
};

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page');
  const questionsResult = await getQuestions({ page });

  if (questionsResult.data) {
    const { questions, totalItems, totalPages, currentPage } = questionsResult.data;
    return { questions, totalItems, totalPages, currentPage };
  }

  throw data(null, { status: STATUS_SERVER });
}

export default QuestionsRoute;
