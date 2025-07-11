import { FilePlus } from 'lucide-react';
import { data, href, Link } from 'react-router';
import { STATUS_CODES } from '~/app/const/status-codes.js';
import { getSession } from '~/app/session.server.js';
import { getQuestions } from '~/lib/http';
import type { TQuestion, TUser } from '~/types/types.js';
import { Button, PageTitle, Pagination, QuestionCard } from '~/ui';
import type { Route } from './+types/questions.route.tsx';

const QuestionsRoute = ({ loaderData }: Route.ComponentProps) => {
  const { user, questions, totalPages, currentPage } = loaderData;

  return (
    <section className="flex flex-col">
      <header className="mb-4 flex items-center gap-4">
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

type LoaderResult = {
  questions: TQuestion[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  user?: TUser;
};

export async function loader({ request }: Route.LoaderArgs): Promise<LoaderResult> {
  const session = await getSession(request.headers.get('Cookie'));
  const user = session.get('user');
  const url = new URL(request.url);
  const page = url.searchParams.get('page');
  const questionsResult = await getQuestions({ page });

  if (questionsResult.data) {
    const { questions, totalItems, totalPages, currentPage } = questionsResult.data;
    return { user, questions, totalItems, totalPages, currentPage };
  }

  throw data(null, { status: STATUS_CODES.SERVER });
}

export default QuestionsRoute;
