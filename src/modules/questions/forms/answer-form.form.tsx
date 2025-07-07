import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Form, useActionData, useSubmit } from 'react-router';
import * as z from 'zod/v4';
import type { TQuestion } from '~/types';
import { Button, FormError, TextEditor } from '~/ui';

type AnswerFormProps = {
  question: TQuestion;
};

export const PostAnswerFormSchema = z.object({
  intent: z.literal('create-answer'),
  content: z.string().trim().nonempty('Answer is required'),
});

export const AnswerForm: React.FC<AnswerFormProps> = () => {
  const actionData = useActionData();
  const form = useForm({ resolver: zodResolver(PostAnswerFormSchema) });
  const submit = useSubmit();

  const onSubmit: SubmitHandler<z.infer<typeof PostAnswerFormSchema>> = (data) => {
    submit(data, { method: 'post' });
  };

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)} method="post">
      <input type="hidden" value="create-answer" {...form.register('intent')} />
      <TextEditor placeholder="Answer" {...form.register('content')} />
      <FormError>{form.formState.errors.content?.message}</FormError>
      <FormError>{actionData?.message}</FormError>
      <Button>Post Answer</Button>
    </Form>
  );
};
