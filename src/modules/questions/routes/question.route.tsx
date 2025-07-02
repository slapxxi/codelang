import type { Route } from './+types/question.route';
import { Code, PageTitle } from '~/ui';
import { getQuestion } from '~/lib/http';

const QuestionRoute = ({ loaderData }: Route.ComponentProps) => {
  const { question } = loaderData;

  if (!question) {
    return null;
  }

  return (
    <div>
      <PageTitle>Question: {question.title}</PageTitle>
      <p>{question.description}</p>
      <Code code={question.attachedCode} />
    </div>
  );
};

export async function loader({ params }: Route.LoaderArgs) {
  const { question, error } = await getQuestion({ id: params.questionId });
  return { question, error };
}

export default QuestionRoute;
