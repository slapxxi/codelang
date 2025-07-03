import type { Route } from './+types/question.route';
import { Code, PageTitle } from '~/ui';
import { getQuestion } from '~/lib/http';
import { STATUS_NOT_FOUND } from '~/app/const';
import { data } from 'react-router';

const QuestionRoute = ({ loaderData }: Route.ComponentProps) => {
  const { question } = loaderData;

  return (
    <div className="flex flex-col gap-2">
      <PageTitle>Question: {question.title}</PageTitle>
      <p>{question.description}</p>
      <Code code={question.formattedCode} />

      <ul className="flex flex-col gap-2">
        {question.answers.map((a) => (
          <li key={a.id} className="p-2 bg-white shadow rounded-lg border-zinc-500/30 border">
            <p>{a.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export async function loader({ params }: Route.LoaderArgs) {
  const questionResult = await getQuestion({ id: params.questionId });

  if (questionResult.data) {
    return { question: questionResult.data };
  }

  throw data(null, { status: STATUS_NOT_FOUND });
}

export default QuestionRoute;
