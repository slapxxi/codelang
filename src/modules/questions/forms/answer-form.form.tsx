import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Form, useActionData, useSubmit } from 'react-router';
import * as z from 'zod/v4';
import type { TQuestion } from '~/types';
import { Button, FormError, TextEditor } from '~/ui';
import type { ActionResult } from '../routes/question.route';

const INTENT = 'create-answer';

type AnswerFormProps = {
  question: TQuestion;
};

export const PostAnswerFormSchema = z.object({
  intent: z.literal(INTENT),
  content: z.string().trim().nonempty('Answer is required'),
});

export const AnswerForm: React.FC<AnswerFormProps> = () => {
  const actionData = useActionData<ActionResult>();
  const form = useForm({ resolver: zodResolver(PostAnswerFormSchema) });
  const submit = useSubmit();

  const onSubmit: SubmitHandler<z.infer<typeof PostAnswerFormSchema>> = (data) => {
    submit(data, { method: 'post' });
  };

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)} method="post" className="flex flex-col gap-2">
      <input type="hidden" value={INTENT} {...form.register('intent')} />
      <TextEditor placeholder="Answer" {...form.register('content')} />
      <FormError>{form.formState.errors.content?.message}</FormError>
      <FormError>{actionData?.errorMessage}</FormError>
      <Button>Post Answer</Button>
    </Form>
  );
};
