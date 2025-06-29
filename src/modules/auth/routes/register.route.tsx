import type { Route } from './+types/register.route';
import { Form, href, redirect } from 'react-router';
import * as z from 'zod/v4';
import { registerUser } from '~/lib/http';
import { LayoutContainer, Input, Logo } from '~/ui';
import { Button } from '~/ui/base';

const RegisterFormSchema = z
  .object({
    username: z.string('Username is required').min(1, 'Username must be at least 1 character long'),
    password: z.string('Password is required').min(1, 'Password must be at least 1 character long'),
    confirmPassword: z.string().min(1, 'Password must be at least 1 character long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export async function loader() {
  let user;

  if (user) {
    return redirect('/');
  }

  return {};
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const username = form.get('username');
  const password = form.get('password');
  const confirmPassword = form.get('confirm-password');
  const { success, data, error } = RegisterFormSchema.safeParse({ username, password, confirmPassword });

  if (success) {
    await registerUser({ username: data.username, password: data.password });
    return redirect(href('/login'));
  }

  return { errors: z.flattenError(error).fieldErrors };
}

const RegisterRoute = ({ actionData }: Route.ComponentProps) => {
  const { errors = {} } = actionData || {};

  return (
    <LayoutContainer className="flex flex-col justify-center gap-4">
      <header className="flex justify-center p-4">
        <Logo size="lg" className="-translate-x-2" />
      </header>

      <Form action={href('/register')} method="POST" className="flex flex-col gap-4 max-w-prose mx-auto">
        <Input type="text" placeholder="Username" name="username" errors={errors.username} />
        <Input type="password" placeholder="Password" name="password" errors={errors.password} />
        <Input type="password" placeholder="Confirm Password" name="confirm-password" errors={errors.confirmPassword} />
        <Button type="submit" className="self-center">
          Register
        </Button>
      </Form>
    </LayoutContainer>
  );
};

export default RegisterRoute;
