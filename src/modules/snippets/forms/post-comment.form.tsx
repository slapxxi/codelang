import { zodResolver } from '@hookform/resolvers/zod';
import { useId } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useSubmit, useNavigation, Form } from 'react-router';
import { Label, Button } from '~/ui';
import * as z from 'zod/v4';

export const PostCommentFormSchema = z.object({
  intent: z.literal('create-comment'),
  comment: z.string().trim().nonempty(),
});

type TPostCommentForm = z.infer<typeof PostCommentFormSchema>;

export function PostCommentForm() {
  const { register, handleSubmit } = useForm<TPostCommentForm>({ resolver: zodResolver(PostCommentFormSchema) });
  const submit = useSubmit();
  const commentId = useId();
  const nav = useNavigation();

  const onSubmit: SubmitHandler<TPostCommentForm> = (data) => {
    submit(data, { method: 'post' });
  };

  return (
    <Form method="post" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <input type="hidden" value="create-comment" {...register('intent')} />
      <Label htmlFor={commentId}>Leave a Comment</Label>
      <textarea
        id={commentId}
        placeholder="Comment..."
        className="border rounded bg-white p-2"
        {...register('comment')}
      ></textarea>
      <Button disabled={nav.state === 'loading' || nav.state === 'submitting'}>Post</Button>
    </Form>
  );
}
