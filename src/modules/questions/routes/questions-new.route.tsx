import type { Route } from './+types/questions-new.route';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { data, Form, href, redirect, useSubmit } from 'react-router';
import * as z from 'zod/v4';
import { STATUS_BAD_REQUEST, STATUS_SERVER } from '~/app/const';
import { getSession } from '~/app/session.server';
import { createQuestion } from '~/lib/http/create-question.http';
import { Button, CodeEditor, FormError, Input, PageTitle } from '~/ui';

const QuestionsNewRoute = () => {
  return (
    <section>
      <PageTitle>New Question</PageTitle>
      <NewQuestionForm />
    </section>
  );
};

const NewQuestionFormSchema = z.object({
  title: z.string().nonempty('Title is required'),
  description: z.string().nonempty('Description is required'),
  code: z.string().nonempty('Code is required'),
});

const NewQuestionForm: React.FC = () => {
  const form = useForm({ resolver: zodResolver(NewQuestionFormSchema) });
  const submit = useSubmit();

  const onSubmit: SubmitHandler<z.infer<typeof NewQuestionFormSchema>> = (data) => {
    submit(data, { method: 'post' });
  };

  return (
    <Form method="post" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <Input type="text" {...form.register('title')} placeholder="Title" className="w-min" />
      <FormError>{form.formState.errors.title?.message}</FormError>

      <Input type="text" {...form.register('description')} placeholder="Description" className="w-min" />
      <FormError>{form.formState.errors.description?.message}</FormError>

      <CodeEditor {...form.register('code')} placeholder="Code" />
      <FormError>{form.formState.errors.code?.message}</FormError>

      <Button>Create</Button>
    </Form>
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
  const parseResult = NewQuestionFormSchema.safeParse(form);

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
