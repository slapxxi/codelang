import { data, href, redirect } from 'react-router';
import { ERROR_TYPES, STATUS_CODES } from '~/app/const';
import { getSession } from '~/app/session.server';
import { createQuestion } from '~/lib/http';
import type { DataWithResponseInit } from '~/types';
import { PageTitle } from '~/ui';
import { QuestionForm, QuestionFormSchema } from '../forms';
import type { Route } from './+types/questions-new.route';

const QuestionsNewRoute = () => {
  return (
    <section>
      <PageTitle>New Question</PageTitle>
      <QuestionForm />
    </section>
  );
};

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('token');

  if (!token) {
    return redirect('/login');
  }
}

type ActionResult = {
  errorMessage?: string;
};

export async function action({ request }: Route.ActionArgs): Promise<Response | DataWithResponseInit<ActionResult>> {
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('token');

  if (!token) {
    return redirect('/login');
  }

  const formData = await request.formData();
  const form = Object.fromEntries(formData);
  const parseResult = QuestionFormSchema.safeParse(form);

  if (parseResult.success) {
    const { title, description, code } = parseResult.data;
    const questionResult = await createQuestion({ title, description, code, token });

    if (questionResult.data) {
      return redirect(href('/questions/:questionId', { questionId: questionResult.data.id }));
    }

    const { error } = questionResult;
    return data(
      { errorMessage: error.message },
      { status: error.type === ERROR_TYPES.SERVER ? error.status : STATUS_CODES.SERVER }
    );
  }

  return data({ errorMessage: 'Invalid data submitted' }, { status: STATUS_CODES.UNPROCESSABLE_ENTITY });
}

export default QuestionsNewRoute;
