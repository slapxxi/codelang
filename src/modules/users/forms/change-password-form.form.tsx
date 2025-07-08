import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useFetcher } from 'react-router';
import * as z from 'zod/v4';
import { Button, FormError, FormSuccess, Input } from '~/ui';

export const ChangePasswordFormSchema = z
  .object({
    type: z.literal('password'),
    oldPassword: z.string().nonempty('Old password is required'),
    newPassword: z
      .string()
      .nonempty('New password is required')
      .refine((v) => /\d/.test(v), 'Password must contain at least one digit')
      .refine((v) => /\p{Ll}/u.test(v), 'Password must contain at least one lowercase letter')
      .refine((v) => /\p{Lu}/u.test(v), 'Password must contain at least one uppercase letter')
      .refine((v) => /[^a-zA-Z0-9]/.test(v), 'Password must contain at least one symbol'),
    confirmNewPassword: z.string().nonempty('Old password is required'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords must match',
    path: ['confirmNewPassword'],
  });

export const ChangePasswordForm = () => {
  const form = useForm({ resolver: zodResolver(ChangePasswordFormSchema) });
  const fetcher = useFetcher();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<z.infer<typeof ChangePasswordFormSchema>> = (data) => {
    fetcher.submit(data, { method: 'post' });
  };

  useEffect(() => {
    form.resetField('oldPassword');
    form.resetField('newPassword');
    form.resetField('confirmNewPassword');
  }, [fetcher.data?.passwordChanged]);

  return (
    <fetcher.Form method="post" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <input type="hidden" value="password" {...form.register('type')} />

      <fieldset className="flex flex-col gap-2 rounded border p-2">
        <legend className="text-sm text-olive-900">Old Password</legend>

        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Old password"
          error={!!form.formState.errors.oldPassword}
          {...form.register('oldPassword')}
        />
        <FormError>{form.formState.errors.oldPassword?.message}</FormError>
      </fieldset>

      <fieldset className="flex flex-col gap-2 rounded border p-2">
        <legend className="text-sm text-olive-900">New Password</legend>

        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="New Password"
          error={!!form.formState.errors.newPassword}
          {...form.register('newPassword')}
        />
        <FormError>{form.formState.errors.newPassword?.message}</FormError>

        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm New Password"
          error={!!form.formState.errors.confirmNewPassword}
          {...form.register('confirmNewPassword')}
        />
        <FormError>{form.formState.errors.confirmNewPassword?.message}</FormError>
      </fieldset>

      <Button variant="link" type="button" onClick={() => setShowPassword(!showPassword)} className="justify-end">
        {showPassword ? 'Hide Password' : 'Show Password'}
      </Button>

      <FormError>{fetcher.data?.message}</FormError>
      <FormSuccess>{fetcher.data?.passwordChanged && 'Password changed successfully'}</FormSuccess>

      <Button disabled={['loading', 'submitting'].includes(fetcher.state)}>Change Password</Button>
    </fetcher.Form>
  );
};
