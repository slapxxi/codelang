import type { Route } from './+types/register.route';
import { data, Form, href, Link, redirect, useNavigation, useSubmit } from 'react-router';
import * as z from 'zod/v4';
import { registerUser } from '~/lib/http';
import { Input, FormError } from '~/ui';
import { Button } from '~/ui/base';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { getSession } from '~/app/session.server';
import { ERROR_TYPE_EXCEPTION, ERROR_TYPE_SERVER, STATUS_BAD_REQUEST, STATUS_SERVER } from '~/app/const';

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
  const { message } = actionData ?? {};
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
    </>
  );
};

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  if (session.has('token')) {
    return redirect('/');
  }
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const username = form.get('username');
  const password = form.get('password');
  const { success, data: parseData } = RegisterUserSchema.safeParse({ username, password });

  if (success) {
    const { error } = await registerUser({ username: parseData.username, password: parseData.password });

    if (error && error.type === ERROR_TYPE_SERVER) {
      return data({ message: error.message }, { status: error.status });
    }

    if (error && error.type === ERROR_TYPE_EXCEPTION) {
      return data({ message: error.message }, { status: STATUS_SERVER });
    }

    return redirect('/login');
  }

  return data({ message: 'Invalid data submitted' }, { status: STATUS_BAD_REQUEST });
}

export default RegisterRoute;
