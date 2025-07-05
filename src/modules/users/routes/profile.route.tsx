import { LogOut, Trash2 } from 'lucide-react';
import { Suspense } from 'react';
import { Await, data, Form, href, redirect } from 'react-router';
import { STATUS_SERVER, STATUS_UNPROCESSABLE_ENTITY } from '~/app/const';
import { getUserFromSession } from '~/app/get-user-from-session.server';
import { commitSession, destroySession, getSession } from '~/app/session.server';
import { changePassword, changeUsername, deleteUser } from '~/lib/http';
import { getUserStats } from '~/lib/http/get-user-stats.http';
import type { TUser } from '~/types';
import { Avatar, FormError, PageTitle, Spinner } from '~/ui';
import { Button } from '~/ui/base';
import { urlToSearchParamsRef } from '~/utils';
import { ChangePasswordForm, ChangePasswordFormSchema, ChangeUsernameForm, ChangeUsernameFormSchema } from '../forms';
import { UserStats } from '../ui';
import type { Route } from './+types/profile.route';

const ProfileRoute = ({ loaderData }: Route.ComponentProps) => {
  const { user, statsLoader } = loaderData;

  function handleLogout(e: React.FormEvent<HTMLFormElement>) {
    if (!confirm('Are you sure you want to logout?')) {
      e.preventDefault();
    }
  }

  function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    if (confirm('Are you sure you want to delete your account permanently?')) {
      if (confirm('Super duper sure?!')) {
        return true;
      }
    }
    e.preventDefault();
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <PageTitle className="flex items-center gap-2 filter-[url('#shimmer')]">
        <Avatar />
        <span>{user.username}</span>
        <Form action={href('/logout')} method="post" onSubmit={handleLogout}>
          <Button>
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
        </Form>
        <Form action={href('/profile')} method="post" onSubmit={handleDelete}>
          <input type="hidden" name="method" value="delete" />
          <Button variant="destructive">
            <Trash2 size={16} />
            <span>Delete Account</span>
          </Button>
        </Form>
      </PageTitle>

      <ChangeUsernameForm user={user} />
      <ChangePasswordForm />

      <Suspense
        fallback={
          <div className="flex gap-2 items-center">
            <Spinner />
            Loading stats...
          </div>
        }
      >
        <Await resolve={statsLoader} errorElement={<FormError>Error loading stats!</FormError>}>
          {(result) => (result.stats ? <UserStats stats={result.stats} /> : <p>{result.message}</p>)}
        </Await>
      </Suspense>
    </div>
  );
};

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUserFromSession(request);

  if (user === null) {
    const ref = urlToSearchParamsRef(request.url);
    return redirect(`/login?${ref}`);
  }

  const result = { user, message: undefined, statsLoader: undefined };
  return data({ ...result, statsLoader: getStats(user) });
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('token');
  const ref = urlToSearchParamsRef(request.url);

  if (!token) {
    return redirect(`/login?${ref}`);
  }

  const result = { message: undefined, passwordChanged: undefined, usernameChanged: undefined };
  const formData = await request.formData();
  const form = Object.fromEntries(formData);

  if (form.method === 'delete') {
    const deleteResult = await deleteUser({ token });

    if (deleteResult.data) {
      return redirect(href('/'), {
        headers: [['Set-Cookie', await destroySession(session)]],
      });
    }

    return data({ ...result, message: deleteResult.error.message }, { status: STATUS_SERVER });
  }

  const passwordParseResult = ChangePasswordFormSchema.safeParse(form);

  if (passwordParseResult.success) {
    const { oldPassword, newPassword } = passwordParseResult.data;
    const changePasswordResult = await changePassword({ oldPassword, newPassword, token });

    if (changePasswordResult.data) {
      return { ...result, passwordChanged: Date.now() };
    }

    return data({ ...result, message: changePasswordResult.error.message }, { status: STATUS_UNPROCESSABLE_ENTITY });
  }

  const usernameParseResult = ChangeUsernameFormSchema.safeParse(form);

  if (usernameParseResult.success) {
    const { username } = usernameParseResult.data;
    const usernameResult = await changeUsername({ username, token });

    if (usernameResult.data) {
      session.set('user', usernameResult.data);
      return data(
        { ...result, usernameChanged: Date.now() },
        {
          headers: [['Set-Cookie', await commitSession(session)]],
        }
      );
    }

    return data({ ...result, message: usernameResult.error.message }, { status: STATUS_UNPROCESSABLE_ENTITY });
  }

  return data(result, { status: STATUS_UNPROCESSABLE_ENTITY });
}

async function getStats(user: TUser) {
  const result = await getUserStats({ id: user.id });

  if (result.data) {
    return { stats: result.data, message: null };
  }

  return { stats: null, message: result.error.message };
}

export default ProfileRoute;
