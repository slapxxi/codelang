import { zodResolver } from '@hookform/resolvers/zod';
import { useId } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Form, useNavigation, useSubmit } from 'react-router';
import * as z from 'zod/v4';
import { Button, Label } from '~/ui';

const INTENT = 'create-comment';

export const PostCommentFormSchema = z.object({
  intent: z.literal(INTENT),
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
      <input type="hidden" value={INTENT} {...register('intent')} />
      <Label htmlFor={commentId}>Leave a Comment</Label>
      <textarea
        id={commentId}
        placeholder="Comment..."
        className="rounded border bg-white p-2"
        {...register('comment')}
      ></textarea>
      <Button disabled={nav.state === 'loading' || nav.state === 'submitting'}>Post</Button>
    </Form>
  );
}
