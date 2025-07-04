import type { Route } from './+types/questions-new.route';
import { data, href, redirect } from 'react-router';
import { STATUS_BAD_REQUEST, STATUS_SERVER } from '~/app/const';
import { getSession } from '~/app/session.server';
import { createQuestion } from '~/lib/http';
import { PageTitle } from '~/ui';
import { QuestionForm, QuestionFormSchema } from '../forms';

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

  return { text: 'hello' };
}

export async function action({ request }: Route.ActionArgs) {
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

    return data(null, { status: STATUS_SERVER });
  }

  return data(null, { status: STATUS_BAD_REQUEST });
}

export default QuestionsNewRoute;
