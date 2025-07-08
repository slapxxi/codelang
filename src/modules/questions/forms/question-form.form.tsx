import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Form, useActionData, useLoaderData, useSubmit } from 'react-router';
import * as z from 'zod/v4';
import { Button, CodeEditor, FormError, Input } from '~/ui';
import type { LoaderResult } from '../routes/question-edit.route';

export const QuestionFormSchema = z.object({
  title: z.string().trim().nonempty('Title is required'),
  description: z.string().trim().nonempty('Description is required'),
  code: z.string().trim(),
});

type QuestionFormProps = {
  children?: React.ReactNode;
};

export const QuestionForm: React.FC<QuestionFormProps> = (props) => {
  const { children } = props;
  const actionData = useActionData();
  const loaderData = useLoaderData<LoaderResult>();
  const form = useForm({
    resolver: zodResolver(QuestionFormSchema),
    defaultValues: {
      title: loaderData?.question.title,
      description: loaderData?.question.description,
      code: loaderData?.question.attachedCode,
    },
  });
  const submit = useSubmit();

  const onSubmit: SubmitHandler<z.infer<typeof QuestionFormSchema>> = (data) => {
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

      <FormError>{actionData?.errorMessage}</FormError>

      {children || <Button>Create</Button>}
    </Form>
  );
};
