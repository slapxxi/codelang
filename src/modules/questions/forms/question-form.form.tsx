import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useSubmit, Form } from 'react-router';
import * as z from 'zod/v4';
import { Input, FormError, CodeEditor, Button } from '~/ui';

export const QuestionFormSchema = z.object({
  title: z.string().nonempty('Title is required'),
  description: z.string().nonempty('Description is required'),
  code: z.string(),
});

export const QuestionForm: React.FC = () => {
  const form = useForm({ resolver: zodResolver(QuestionFormSchema) });
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

      <Button>Create</Button>
    </Form>
  );
};
