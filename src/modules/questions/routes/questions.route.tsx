import type { Route } from './+types/questions.route.tsx';
import { href, Link } from 'react-router';
import { getQuestions } from '~/lib/http';
import { PageTitle, Pagination } from '~/ui';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page');
  const { data, error } = await getQuestions({ page });

  if (data) {
    const { questions, totalItems, totalPages } = data;
    return { questions, totalItems, totalPages, currentPage: page ? parseInt(page) : 1 };
  }

  return { error };
}

const QuestionsRoute = ({ loaderData }: Route.ComponentProps) => {
  const { error, questions, totalPages, currentPage } = loaderData;

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="flex flex-col">
      <PageTitle>Questions</PageTitle>

      <ul>
        {questions!.map((q) => (
          <li key={q.id}>
            <Link to={href('/questions/:questionId', { questionId: q.id })}>{q.title}</Link>
          </li>
        ))}
      </ul>

      <Pagination numberOfPages={totalPages!} currentPage={currentPage} maxDisplayed={10} />
    </div>
  );
};

export default QuestionsRoute;
