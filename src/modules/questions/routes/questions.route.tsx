import { FilePlus } from 'lucide-react';
import type { Route } from './+types/questions.route.tsx';
import { data, href, Link } from 'react-router';
import { STATUS_SERVER } from '~/app/const/status-codes.js';
import { useAuth } from '~/hooks/use-auth.hook.js';
import { getQuestions } from '~/lib/http';
import { Button, PageTitle, Pagination, QuestionCard } from '~/ui';

const QuestionsRoute = ({ loaderData }: Route.ComponentProps) => {
  const { questions, totalPages, currentPage } = loaderData;
  const user = useAuth();

  return (
    <section className="flex flex-col">
      <header className="flex gap-4 items-center mb-4">
        <PageTitle> Questions </PageTitle>
        {user && (
          <Button asChild>
            <Link to={href('/questions/new')}>
              <FilePlus size={16} />
              <span>New Question</span>
            </Link>
          </Button>
        )}
      </header>

      <ul className="flex flex-col gap-2">
        {questions!.map((q) => (
          <QuestionCard key={q.id} question={q} />
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
