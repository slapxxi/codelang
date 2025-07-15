import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { data, Form, href, Link, redirect, useNavigation, useSubmit } from 'react-router';
import * as z from 'zod/v4';
import { ERROR_MESSAGES, STATUS_CODES } from '~/app/const';
import { commitSession, getSession } from '~/app/session.server';
import { loginUser } from '~/lib/http';
import { FormError, Input } from '~/ui';
import { Button } from '~/ui/base';
import type { Route } from './+types/login.route';

const LoginFormSchema = z.object({
  username: z.string().nonempty('Username is required'),
  password: z.string().nonempty('Password is required'),
});

type TLoginForm = z.infer<typeof LoginFormSchema>;

const LoginRoute = ({ actionData }: Route.ComponentProps) => {
  const { errorMessage } = actionData ?? {};
  // todo: use separate form
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
        className="mx-auto flex max-w-prose flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          type="text"
          placeholder="Username"
          error={!!formState.errors.username}
          className="w-60 self-center"
          disabled={nav.state === 'submitting'}
          {...register('username')}
        />
        <FormError error={formState.errors.username?.message} />

        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          error={!!formState.errors.password}
          className="w-60 self-center"
          disabled={nav.state === 'submitting'}
          {...register('password')}
        />
        <FormError error={formState.errors.password?.message} />

        <button
          className="w-60 self-center text-right text-sm text-zinc-500 hover:text-zinc-800"
          type="button"
          onClick={() => setShowPassword((sp) => !sp)}
        >
          {showPassword ? 'Hide' : 'Show'} Password
        </button>

        <Button type="submit" className="self-center" disabled={['submitting', 'loading'].includes(nav.state)}>
          Login
        </Button>
      </Form>

      {errorMessage && <div className="text-center text-sm text-destructive">{errorMessage}</div>}

      <div className="max-h-4 flex-1" />

      <Link to={href('/register')} className="self-center text-sm text-zinc-500 hover:text-zinc-800">
        Don&apos;t have an account? Register
      </Link>
    </>
  );
};

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  if (session.has('token')) {
    const url = new URL(request.url);
    const ref = url.searchParams.get('ref') || '/';
    return redirect(ref);
  }
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const url = new URL(request.url);
  const ref = url.searchParams.get('ref') || '/';
  const formData = await request.formData();
  const form = Object.fromEntries(formData);
  const formDataParsingResult = LoginFormSchema.safeParse(form);

  if (formDataParsingResult.success) {
    const { username, password } = formDataParsingResult.data;
    const loginResult = await loginUser({ username, password });

    if (loginResult.data) {
      session.set('token', loginResult.data.token);
      session.set('user', loginResult.data.user);
      return redirect(ref, {
        headers: [['Set-Cookie', await commitSession(session)]],
      });
    }

    return data({ errorMessage: loginResult.error.message }, { status: STATUS_CODES.SERVER });
  }

  return data({ errorMessage: ERROR_MESSAGES.INVALID_DATA }, { status: STATUS_CODES.UNPROCESSABLE_ENTITY });
}

export default LoginRoute;
