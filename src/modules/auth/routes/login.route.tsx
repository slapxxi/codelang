import type { Route } from './+types/login.route';
import { data, Form, href, Link, redirect, useNavigation, useSubmit } from 'react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import * as z from 'zod/v4';

import { Button } from '~/ui/base';
import { Input, FormError } from '~/ui';
import { loginUser } from '~/lib/http';
import { commitSession, getSession } from '~/app/session.server';

const LoginFormSchema = z.object({
  username: z.string().nonempty('Username is required'),
  password: z.string().nonempty('Password is required'),
});

type TLoginForm = z.infer<typeof LoginFormSchema>;

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  if (session.has('token')) {
    return redirect('/');
  }

  return data({ error: session.get('error') }, { headers: { 'Set-Cookie': await commitSession(session) } });
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const form = await request.formData();
  const username = form.get('username');
  const password = form.get('password');
  const formDataParsingResult = LoginFormSchema.safeParse({ username, password });

  if (formDataParsingResult.success) {
    const { username, password } = formDataParsingResult.data;
    const { data, error } = await loginUser({ username, password });

    if (error?.type === 'server') {
      return { errors: error.e, message: error.message };
    }

    if (error?.type === 'unknown') {
      return { message: 'Something went wrong!' };
    }

    if (data) {
      session.set('token', data.token);
      session.set('user', data.user);
      return redirect(href('/'), {
        headers: [
          ['Set-Cookie', await commitSession(session)],
          ['Set-Cookie', data.cookie],
        ],
      });
    }

    throw new Error('Something went wrong');
  }

  return { message: 'Invalid credentials' };
}

const LoginRoute = ({ actionData }: Route.ComponentProps) => {
  const { message } = actionData ?? {};
  const { register, handleSubmit, formState } = useForm<TLoginForm>({ resolver: zodResolver(LoginFormSchema) });
  const [showPassword, setShowPassword] = useState(false);
  const submit = useSubmit();
  const nav = useNavigation();

  const onSubmit: SubmitHandler<TLoginForm> = (data) => {
    submit(data, { method: 'post' });
  };

  return (
    <>
      <Form
        action={href('/login')}
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

        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          error={!!formState.errors.password}
          className="self-center w-60"
          disabled={nav.state === 'submitting'}
          {...register('password')}
        />
        <FormError error={formState.errors.password?.message} />

        <button
          className="text-sm text-zinc-500 hover:text-zinc-800 text-right w-60 self-center"
          type="button"
          onClick={() => setShowPassword((sp) => !sp)}
        >
          {showPassword ? 'Hide' : 'Show'} Password
        </button>

        <Button type="submit" className="self-center" disabled={nav.state === 'submitting'}>
          Login
        </Button>
      </Form>

      {message && <div className="text-destructive text-sm text-center">{message}</div>}

      <div className="flex-1 max-h-4" />

      <Link to={href('/register')} className="self-center text-sm text-zinc-500 hover:text-zinc-800">
        Don&apos;t have an account? Register
      </Link>
    </>
  );
};

export default LoginRoute;
