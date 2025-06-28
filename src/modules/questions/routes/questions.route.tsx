import type { Route } from './+types/questions.route.tsx';
import { href, Link } from 'react-router';
import { getQuestions } from '~/lib/http';
import { PageTitle, Pagination } from '~/ui';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page');
  const { questions, totalItems, totalPages } = await getQuestions({ page });
  return { questions, totalItems, totalPages, currentPage: page ? parseInt(page) : 1 };
}

const QuestionsRoute = ({ loaderData }: Route.DataArgs) => {
  const { questions, totalPages, currentPage } = loaderData;

  return (
    <div className="flex flex-col">
      <PageTitle>Questions</PageTitle>
      <ul>
        {questions.map((q) => (
          <li key={q.id}>
            <Link to={href('/questions/:questionId', { questionId: q.id })}>{q.title}</Link>
          </li>
        ))}
      </ul>
      <Pagination numberOfPages={totalPages} currentPage={currentPage} maxDisplayed={10} />
    </div>
  );
};

export default QuestionsRoute;
