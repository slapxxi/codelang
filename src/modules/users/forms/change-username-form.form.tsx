import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useFetcher } from 'react-router';
import * as z from 'zod/v4';
import type { TUser } from '~/types';
import { Button, FormError, FormSuccess, Input } from '~/ui';

export const ChangeUsernameFormSchema = z.object({
  type: z.literal('username'),
  username: z.string().nonempty('Username is required').min(5),
});

type ChangeUsernameFormProps = {
  user: TUser;
};

export const ChangeUsernameForm: React.FC<ChangeUsernameFormProps> = (props) => {
  const { user } = props;
  const form = useForm({
    defaultValues: { username: user.username },
    resolver: zodResolver(
      ChangeUsernameFormSchema.check((ctx) => {
        if (ctx.value.username === user.username) {
          ctx.issues.push({
            input: ctx.value.username,
            path: ['username'],
            code: 'custom',
            message: 'Username must be different from the current one',
          });
        }
      })
    ),
  });
  const fetcher = useFetcher();

  const onSubmit: SubmitHandler<z.infer<typeof ChangeUsernameFormSchema>> = (data) => {
    fetcher.submit(data, { method: 'post' });
  };

  useEffect(() => {
    form.resetField('username', { defaultValue: user.username });
  }, [user.username]);

  return (
    <fetcher.Form method="post" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <input type="hidden" value="username" {...form.register('type')} />
      <Input
        type="text"
        placeholder="Username"
        error={!!form.formState.errors.username}
        {...form.register('username')}
      />
      <FormError>{form.formState.errors.username?.message}</FormError>

      <FormError>{fetcher.data?.message}</FormError>
      <FormSuccess>{fetcher.data?.usernameChanged && 'Username changed successfully'}</FormSuccess>

      <Button disabled={['loading', 'submitting'].includes(fetcher.state)}>Change Username</Button>
    </fetcher.Form>
  );
};
