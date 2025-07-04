import type { Route } from './+types/question.route';
import { Button, Card, Code, PageTitle, TextEditor } from '~/ui';
import { deleteQuestion, getQuestion } from '~/lib/http';
import { ERROR_TYPE_SERVER, STATUS_BAD_REQUEST, STATUS_NOT_FOUND, STATUS_SERVER } from '~/app/const';
import { data, Form, href, Link, redirect, useFetcher, useNavigation } from 'react-router';
import { Pencil, Trash2 } from 'lucide-react';
import { getSession } from '~/app/session.server';
import type { TQuestion } from '~/types';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod/v4';
import { urlToSearchParamsRef } from '~/utils';

const QuestionRoute = ({ loaderData }: Route.ComponentProps) => {
  const { question, user } = loaderData;
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

      {user ? (
        <AnswerForm question={question}></AnswerForm>
      ) : (
        <div className="flex gap-2 items-center">
          <Form action={href('/login')} className="link">
            <Button name="ref" value={href('/questions/:questionId', { questionId: question.id })}>
              Login
            </Button>
          </Form>
          to be able to post answers!
        </div>
      )}

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

type AnswerFormProps = {
  question: TQuestion;
};

const PostAnswerFormSchema = z.object({
  content: z.string().nonempty('Answer is required'),
});

export const AnswerForm: React.FC<AnswerFormProps> = (props) => {
  const { question } = props;
  const form = useForm({ resolver: zodResolver(PostAnswerFormSchema) });
  const fetcher = useFetcher();

  const onSubmit: SubmitHandler<z.infer<typeof PostAnswerFormSchema>> = (data) => {
    fetcher.submit(data, {
      method: 'post',
      action: href('/questions/:questionId/answers', { questionId: question.id }),
    });
  };

  return (
    <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
      <TextEditor placeholder="Answer" {...form.register('content')} />
      <Button>Post Answer</Button>
    </fetcher.Form>
  );
};

export async function loader({ params, request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const user = session.get('user');
  const questionResult = await getQuestion({ id: params.questionId });

  if (questionResult.data) {
    return { question: questionResult.data, user };
  }

  throw data(null, { status: STATUS_NOT_FOUND });
}

export async function action({ params, request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('token');
  const ref = urlToSearchParamsRef(request.url);

  if (!token) {
    return redirect(`/login?${ref}`);
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
