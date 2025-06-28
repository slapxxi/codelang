import { PageTitle } from '~/ui';
import type { Route } from './+types/question.route';
import { getQuestion } from '~/lib/http';

export async function loader({ params }: Route.LoaderArgs) {
  const { question, error } = await getQuestion({ id: params.questionId });
  return { question };
}

const QuestionRoute = ({ loaderData }: Route.DataArgs) => {
  const { question } = loaderData;

  return (
    <div>
      <PageTitle>Question: {question.title}</PageTitle>

      <p>{question.description}</p>

      <pre dangerouslySetInnerHTML={{ __html: question.attachedCode }} className="*:p-2 *:rounded *:shadow" />
    </div>
  );
};

export default QuestionRoute;
