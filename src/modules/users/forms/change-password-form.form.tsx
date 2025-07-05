import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Form, useActionData, useNavigation, useSubmit } from 'react-router';
import * as z from 'zod/v4';
import { Button, FormError, FormSuccess, Input } from '~/ui';

export const ChangePasswordFormSchema = z
  .object({
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
  const actionData = useActionData();
  const form = useForm({ resolver: zodResolver(ChangePasswordFormSchema) });
  const submit = useSubmit();
  const nav = useNavigation();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<z.infer<typeof ChangePasswordFormSchema>> = (data) => {
    submit(data, { method: 'post' });
  };

  return (
    <Form method="post" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <fieldset className="border p-2 rounded flex flex-col gap-2">
        <legend className="text-sm text-olive-900">Old Password</legend>

        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Old password"
          error={!!form.formState.errors.oldPassword}
          {...form.register('oldPassword')}
        />
        <FormError>{form.formState.errors.oldPassword?.message}</FormError>
      </fieldset>

      <fieldset className="border p-2 rounded flex flex-col gap-2">
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

      <FormError>{actionData?.message}</FormError>
      <FormSuccess>{actionData?.passwordChanged && 'Password changed successfully'}</FormSuccess>

      <Button disabled={['loading', 'submitting'].includes(nav.state)}>Change Password</Button>
    </Form>
  );
};
