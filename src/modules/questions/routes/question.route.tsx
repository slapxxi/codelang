import type { Route } from './+types/question.route';
import { Button, Card, Code, PageTitle } from '~/ui';
import { deleteQuestion, getQuestion } from '~/lib/http';
import { ERROR_TYPE_SERVER, STATUS_BAD_REQUEST, STATUS_NOT_FOUND, STATUS_SERVER } from '~/app/const';
import { data, Form, href, Link, redirect, useNavigation } from 'react-router';
import { useAuth } from '~/hooks';
import { Pencil, Trash2 } from 'lucide-react';
import { getSession } from '~/app/session.server';

const QuestionRoute = ({ loaderData }: Route.ComponentProps) => {
  const { question } = loaderData;
  const user = useAuth();
  const nav = useNavigation();

  function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    if (!confirm('Are you sure you want to delete this question?')) {
      e.preventDefault();
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <PageTitle className="flex gap-2 items-center">
        <span>Question: {question.title}</span>
        {user && question.user.id === user.id && (
          <>
            <Button asChild size="sm" variant="link">
              <Link to={href('/questions/:questionId/edit', { questionId: question.id })}>
                <Pencil size={16} />
                Edit
              </Link>
            </Button>
            <Form method="post" onSubmit={handleDelete}>
              <input type="hidden" name="method" value="delete" />
              <Button size="sm" variant="destructive" disabled={['loading', 'submitting'].includes(nav.state)}>
                <Trash2 size={16} />
                Delete
              </Button>
            </Form>
          </>
        )}
      </PageTitle>
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

export async function action({ params, request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('token');

  if (!token) {
    return redirect('/login');
  }

  const formData = await request.formData();
  const form = Object.fromEntries(formData);

  if (form.method === 'delete') {
    const deleteResult = await deleteQuestion({ id: params.questionId, token });

    if (deleteResult.data) {
      return redirect(href('/questions'));
    }

    const { error } = deleteResult;
    return data(null, { status: error.type === ERROR_TYPE_SERVER ? error.status : STATUS_SERVER });
  }

  return data(null, { status: STATUS_BAD_REQUEST });
}

export default QuestionRoute;
