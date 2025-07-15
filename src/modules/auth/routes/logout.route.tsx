import { Form, href, Link, redirect } from 'react-router';
import { destroySession, getSession } from '~/app/session.server';
import { FormSuccess } from '~/ui';
import { Button } from '~/ui/base';
import type { Route } from './+types/logout.route';

const LogoutRoute = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-sm text-zinc-500">Are you sure you want to log out?</div>

      <Form method="post">
        <Button variant="destructive">Logout</Button>
      </Form>

      <FormSuccess asChild className="hover:underline">
        <Link to={href('/')}>Never mind</Link>
      </FormSuccess>
    </div>
  );
};

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  return redirect('/login', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
}

export default LogoutRoute;
