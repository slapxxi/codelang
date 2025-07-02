import { destroySession, getSession } from '~/app/session.server';
import type { Route } from './+types/logout.route';
import { Form, href, Link, redirect } from 'react-router';
import { Button } from '~/ui/base';

const LogoutRoute = () => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <p>Are you sure you want to log out?</p>

      <Form method="post">
        <Button>Logout</Button>
      </Form>

      <Link to={href('/')}>Never mind</Link>
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
