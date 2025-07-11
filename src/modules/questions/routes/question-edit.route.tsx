import { data, href, redirect } from 'react-router';
import { ERROR_TYPE_SERVER, STATUS_CODES } from '~/app/const';
import { getSession } from '~/app/session.server';
import { getQuestion, updateQuestion } from '~/lib/http';
import type { DataWithResponseInit, TQuestion } from '~/types';
import { Button, PageTitle } from '~/ui';
import { QuestionForm, QuestionFormSchema } from '../forms';
import type { Route } from './+types/question-edit.route';

const QuestionEditRoute = ({ loaderData }: Route.ComponentProps) => {
  const { question } = loaderData;

  return (
    <section>
      <PageTitle>Edit Question: {question.title}</PageTitle>
      <QuestionForm>
        <Button>Update</Button>
      </QuestionForm>
    </section>
  );
};

export type LoaderResult = {
  question: TQuestion;
};

export async function loader({ params }: Route.LoaderArgs): Promise<LoaderResult> {
  const questionResult = await getQuestion({ id: params.questionId });

  if (questionResult.data) {
    return { question: questionResult.data };
  }

  throw data(null, { status: STATUS_CODES.NOT_FOUND });
}

type ActionResult = {
  errorMessage?: string;
};

export async function action({
  params,
  request,
}: Route.ActionArgs): Promise<Response | DataWithResponseInit<ActionResult>> {
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('token');

  if (!token) {
    return redirect('/login');
  }

  const formData = await request.formData();
  const form = Object.fromEntries(formData);
  const validateResult = QuestionFormSchema.safeParse(form);

  if (validateResult.success) {
    const { title, description, code } = validateResult.data;
    const questionResult = await updateQuestion({ id: params.questionId, title, description, code, token });

    if (questionResult.data) {
      return redirect(href('/questions/:questionId', { questionId: questionResult.data.id }));
    }

    const { error } = questionResult;
    return data(
      { errorMessage: error.message },
      { status: error.type === ERROR_TYPE_SERVER ? error.status : STATUS_CODES.SERVER }
    );
  }

  return data({ errorMessage: 'Invalid data submitted' }, { status: STATUS_CODES.UNPROCESSABLE_ENTITY });
}

export default QuestionEditRoute;
