import type { Route } from './+types/question.route';
import { Card, Code, PageTitle } from '~/ui';
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
          <Card asChild key={a.id} variant="secondary">
            <li className="p-2">{a.content}</li>
          </Card>
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
