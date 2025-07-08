import { Pencil, Trash2 } from 'lucide-react';
import { data, Form, href, Link, redirect, useNavigation } from 'react-router';
import {
  ERROR_TYPE_SERVER,
  STATUS_BAD_REQUEST,
  STATUS_CREATED,
  STATUS_NOT_FOUND,
  STATUS_SERVER,
  STATUS_UNPROCESSABLE_ENTITY,
} from '~/app/const';
import { emitter } from '~/app/emitter.server';
import { getSession } from '~/app/session.server';
import { deleteQuestion, getQuestion, postAnswer } from '~/lib/http';
import type { DataWithResponseInit, TQuestion, TUser } from '~/types';
import { Button, Code, CommentsSection, LoginMessage, PageTitle } from '~/ui';
import { urlToSearchParamsRef } from '~/utils';
import { AnswerForm, PostAnswerFormSchema } from '../forms';
import { useAnswerEvents } from '../hooks';
import type { Route } from './+types/question.route';

const QuestionRoute = ({ loaderData, actionData }: Route.ComponentProps) => {
  const { question, user } = loaderData;
  const nav = useNavigation();

  useAnswerEvents();

  function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    if (!confirm('Are you sure you want to delete this question?')) {
      e.preventDefault();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <PageTitle className="flex items-center gap-2">
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
              <input type="hidden" name="intent" value="delete-question" />
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
        <AnswerForm question={question} key={actionData?.postedAnswer?.id}></AnswerForm>
      ) : (
        <LoginMessage>to be able to post an answer</LoginMessage>
      )}

      <CommentsSection title="Answers" data={question.answers}>
        {(answer) => answer.content}
      </CommentsSection>
    </div>
  );
};

type LoaderResult = {
  question: TQuestion;
  user?: TUser;
};

export async function loader({ params, request }: Route.LoaderArgs): Promise<LoaderResult> {
  const session = await getSession(request.headers.get('Cookie'));
  const user = session.get('user');
  const questionResult = await getQuestion({ id: params.questionId });

  if (questionResult.data) {
    return { question: questionResult.data, user };
  }

  throw data(null, { status: STATUS_NOT_FOUND });
}

export type ActionResult = {
  postedAnswer?: TQuestion['answers'][0];
  errorMessage?: string;
};

export async function action({
  params,
  request,
}: Route.ActionArgs): Promise<Response | DataWithResponseInit<ActionResult>> {
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('token');
  const ref = urlToSearchParamsRef(request.url);

  if (!token) {
    return redirect(`/login?${ref}`);
  }

  const formData = await request.formData();
  const form = Object.fromEntries(formData);

  if (form.intent === 'delete-question') {
    const deleteResult = await deleteQuestion({ id: params.questionId, token });

    if (deleteResult.data) {
      return redirect(href('/questions'));
    }

    const { error } = deleteResult;
    return data({}, { status: error.type === ERROR_TYPE_SERVER ? error.status : STATUS_SERVER });
  }

  if (form.intent === 'create-answer') {
    const parseResult = PostAnswerFormSchema.safeParse(form);

    if (parseResult.success) {
      const { content } = parseResult.data;
      const postResult = await postAnswer({ questionId: params.questionId, content, token });

      if (postResult.data) {
        emitter.emit('answer', postResult.data);
        return data({ postedAnswer: postResult.data }, { status: STATUS_CREATED });
      }

      const { error } = postResult;
      return data(
        { errorMessage: error.message },
        { status: error.type === ERROR_TYPE_SERVER ? error.status : STATUS_SERVER }
      );
    }

    return data({}, { status: STATUS_UNPROCESSABLE_ENTITY });
  }

  return data({}, { status: STATUS_BAD_REQUEST });
}

export default QuestionRoute;
