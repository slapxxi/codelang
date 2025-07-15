import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { data, Form, href, Link, redirect, useNavigation, useSubmit } from 'react-router';
import * as z from 'zod/v4';
import { ERROR_TYPES, STATUS_CODES } from '~/app/const';
import { getSession } from '~/app/session.server';
import { registerUser } from '~/lib/http';
import type { DataWithResponseInit } from '~/types';
import { Button, FormError, Input } from '~/ui';
import type { Route } from './+types/register.route';

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

const RegisterFormSchema = z
  .object({
    ...RegisterUserSchema.shape,
    confirmPassword: z.string().nonempty('Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

type TRegisterForm = z.infer<typeof RegisterFormSchema>;

const RegisterRoute = ({ actionData }: Route.ComponentProps) => {
  const { errorMessage } = actionData ?? {};
  // todo: move to separate form
  const { register, handleSubmit, formState } = useForm<TRegisterForm>({ resolver: zodResolver(RegisterFormSchema) });
  const [showPassword, setShowPassword] = useState(false);
  const submit = useSubmit();
  const nav = useNavigation();

  const onSubmit: SubmitHandler<TRegisterForm> = (data) => {
    submit(data, { method: 'post' });
  };

  return (
    <>
      <Form
        action={href('/register')}
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

        <button
          className="w-60 self-center text-right text-sm text-zinc-500 hover:text-zinc-800"
          type="button"
          onClick={() => setShowPassword((sp) => !sp)}
        >
          {showPassword ? 'Hide' : 'Show'} Password
        </button>
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          error={!!formState.errors.password}
          className="w-60 self-center"
          disabled={nav.state === 'submitting'}
          {...register('password')}
        />
        <FormError error={formState.errors.password?.message} />

        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm Password"
          error={!!formState.errors.confirmPassword}
          className="w-60 self-center"
          disabled={nav.state === 'submitting'}
          {...register('confirmPassword')}
        />
        <FormError error={formState.errors.confirmPassword?.message} />

        <Button type="submit" className="self-center" disabled={nav.state === 'submitting'}>
          Register
        </Button>
      </Form>

      {errorMessage && <div className="text-center text-sm text-destructive">{errorMessage}</div>}

      <div className="max-h-4 flex-1" />

      <Link to={href('/login')} className="self-center text-sm text-zinc-500 hover:text-zinc-800">
        Already registered? Login
      </Link>
    </>
  );
};

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  if (session.has('token')) {
    return redirect('/');
  }
}

type ActionResult = {
  errorMessage?: string;
};

export async function action({ request }: Route.ActionArgs): Promise<Response | DataWithResponseInit<ActionResult>> {
  const form = await request.formData();
  const username = form.get('username');
  const password = form.get('password');
  const parseResult = RegisterUserSchema.safeParse({ username, password });

  if (parseResult.success) {
    const { username, password } = parseResult.data;
    const registerResult = await registerUser({ username, password });

    if (registerResult.data) {
      return redirect('/login');
    }

    const { error } = registerResult;
    return data(
      { errorMessage: error.message },
      { status: error.type === ERROR_TYPES.SERVER ? error.status : STATUS_CODES.SERVER }
    );
  }

  return data({ errorMessage: 'Invalid data submitted' }, { status: STATUS_CODES.UNPROCESSABLE_ENTITY });
}

export default RegisterRoute;
