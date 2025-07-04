import { data, href, redirect } from 'react-router';
import type { Route } from './+types/question-edit.route';
import { Button, PageTitle } from '~/ui';
import { STATUS_NOT_FOUND, STATUS_SERVER, STATUS_UNPROCESSABLE_ENTITY } from '~/app/const';
import { getSession } from '~/app/session.server';
import { getQuestion, updateQuestion } from '~/lib/http';
import { QuestionForm, QuestionFormSchema } from '../forms';

const QuestionEditRoute = ({ loaderData }: Route.ComponentProps) => {
  const { question } = loaderData;

  return (
    <section>
      <PageTitle>Edit Question: {question.title}</PageTitle>
      <QuestionForm
        defaultValues={{ title: question.title, description: question.description, code: question.attachedCode }}
      >
        <Button>Update</Button>
      </QuestionForm>
    </section>
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
  const validateResult = QuestionFormSchema.safeParse(form);

  if (validateResult.success) {
    const { title, description, code } = validateResult.data;
    const questionResult = await updateQuestion({ id: params.questionId, title, description, code, token });

    if (questionResult.data) {
      return redirect(href('/questions/:questionId', { questionId: questionResult.data.id }));
    }

    return data(null, { status: STATUS_SERVER });
  }

  return data(null, { status: STATUS_UNPROCESSABLE_ENTITY });
}

export default QuestionEditRoute;
