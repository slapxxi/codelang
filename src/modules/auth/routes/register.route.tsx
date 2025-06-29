import type { Route } from './+types/register.route';
import { data, Form, href, Link, redirect, useNavigation, useSubmit } from 'react-router';
import * as z from 'zod/v4';
import { registerUser } from '~/lib/http';
import { LayoutContainer, Input, Logo, FormError } from '~/ui';
import { Button } from '~/ui/base';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { commitSession, getSession } from '~/app/session.server';

const RegisterUserSchema = z.object({
  username: z.string('Username is required').min(5),
  password: z
    .string('Password is required')
    .nonempty()
    .refine((v) => /\d/.test(v), 'Password must contain at least one digit')
    .refine((v) => /\p{Ll}/u.test(v), 'Password must contain at least one lowercase letter')
    .refine((v) => /\p{Lu}/u.test(v), 'Password must contain at least one uppercase letter')
    .refine((v) => /[^a-zA-Z0-9]/.test(v), 'Password must contain at least one symbol'),
});

const RegisterFormSchema = RegisterUserSchema.extend({
  confirmPassword: z.string().nonempty('Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

type TRegisterForm = z.infer<typeof RegisterFormSchema>;

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  if (session.has('token')) {
    return redirect('/');
  }

  return data({ error: session.get('error') }, { headers: { 'Set-Cookie': await commitSession(session) } });
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const username = form.get('username');
  const password = form.get('password');
  const { success, data } = RegisterUserSchema.safeParse({ username, password });

  if (success) {
    const result = await registerUser({ username: data.username, password: data.password });

    if (result.error === 'server') {
      return { errors: result.errors, message: result.message };
    }

    if (result.error === 'unknown') {
      return { errors: [{ message: 'Something went wrong' }], message: 'Something went wrong!' };
    }

    return redirect('/login');
  }

  return { message: 'Invalid data submitted' };
}

const RegisterRoute = ({ actionData }: Route.ComponentProps) => {
  const { message } = actionData ?? {};
  const { register, handleSubmit, formState } = useForm<TRegisterForm>({ resolver: zodResolver(RegisterFormSchema) });
  const [showPassword, setShowPassword] = useState(false);
  const submit = useSubmit();
  const nav = useNavigation();

  const onSubmit: SubmitHandler<TRegisterForm> = (data) => {
    submit(data, { method: 'post' });
  };

  return (
    <LayoutContainer className="flex flex-col justify-center gap-4">
      <header className="flex justify-center p-4">
        <Logo size="lg" className="-translate-x-2" />
      </header>

      <Form
        action={href('/register')}
        method="POST"
        className="flex flex-col gap-2 max-w-prose mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          type="text"
          placeholder="Username"
          error={!!formState.errors.username}
          className="self-center w-60"
          disabled={nav.state === 'submitting'}
          {...register('username')}
        />
        <FormError error={formState.errors.username?.message} />

        <button
          className="text-sm text-zinc-500 hover:text-zinc-800 text-right w-60 self-center"
          type="button"
          onClick={() => setShowPassword((sp) => !sp)}
        >
          {showPassword ? 'Hide' : 'Show'} Password
        </button>
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          error={!!formState.errors.password}
          className="self-center w-60"
          disabled={nav.state === 'submitting'}
          {...register('password')}
        />
        <FormError error={formState.errors.password?.message} />

        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm Password"
          error={!!formState.errors.confirmPassword}
          className="self-center w-60"
          disabled={nav.state === 'submitting'}
          {...register('confirmPassword')}
        />
        <FormError error={formState.errors.confirmPassword?.message} />

        <Button type="submit" className="self-center" disabled={nav.state === 'submitting'}>
          Register
        </Button>
      </Form>

      {message && <div className="text-destructive text-sm text-center">{message}</div>}

      <div className="flex-1 max-h-4" />

      <Link to={href('/login')} className="self-center text-sm text-zinc-500 hover:text-zinc-800">
        Already registered? Login
      </Link>
    </LayoutContainer>
  );
};

export default RegisterRoute;
