import { LogOut, Trash2 } from 'lucide-react';
import { Suspense } from 'react';
import { Await, data, Form, href, redirect } from 'react-router';
import { STATUS_CODES } from '~/app/const';
import { getUserFromSession } from '~/app/get-user-from-session.server';
import { commitSession, destroySession, getSession } from '~/app/session.server';
import { changePassword, changeUsername, deleteUser } from '~/lib/http';
import { getUserStats } from '~/lib/http/get-user-stats.http';
import type { DataWithResponseInit, TUser } from '~/types';
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
    <div className="flex w-full flex-col gap-4">
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
          <div className="flex items-center gap-2">
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

type LoaderResult = {
  user: TUser;
  statsLoader: ReturnType<typeof getStats>;
};

export async function loader({ request }: Route.LoaderArgs): Promise<Response | DataWithResponseInit<LoaderResult>> {
  const user = await getUserFromSession(request);

  if (user === null) {
    const ref = urlToSearchParamsRef(request.url);
    return redirect(`/login?${ref}`);
  }

  return data({ user, statsLoader: getStats(user) });
}

async function getStats(user: TUser) {
  const result = await getUserStats({ id: user.id });
  if (result.data) {
    return { stats: result.data, message: null };
  }
  return { stats: null, message: result.error.message };
}

type ActionResult = {
  message?: string;
  passwordChanged?: number;
  usernameChanged?: number;
};

export async function action({
  request,
}: Route.ActionArgs): Promise<Response | ActionResult | DataWithResponseInit<ActionResult>> {
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('token');
  const ref = urlToSearchParamsRef(request.url);

  if (!token) {
    return redirect(`/login?${ref}`);
  }

  const formData = await request.formData();
  const form = Object.fromEntries(formData);

  if (form.method === 'delete') {
    const deleteResult = await deleteUser({ token });

    if (deleteResult.data) {
      return redirect(href('/'), {
        headers: [['Set-Cookie', await destroySession(session)]],
      });
    }

    return data({ message: deleteResult.error.message }, { status: STATUS_CODES.SERVER });
  }

  const passwordParseResult = ChangePasswordFormSchema.safeParse(form);

  if (passwordParseResult.success) {
    const { oldPassword, newPassword } = passwordParseResult.data;
    const changePasswordResult = await changePassword({ oldPassword, newPassword, token });

    if (changePasswordResult.data) {
      return { passwordChanged: Date.now() };
    }

    return data({ message: changePasswordResult.error.message }, { status: STATUS_CODES.UNPROCESSABLE_ENTITY });
  }

  const usernameParseResult = ChangeUsernameFormSchema.safeParse(form);

  if (usernameParseResult.success) {
    const { username } = usernameParseResult.data;
    const usernameResult = await changeUsername({ username, token });

    if (usernameResult.data) {
      session.set('user', usernameResult.data);
      return data(
        { usernameChanged: Date.now() },
        {
          headers: [['Set-Cookie', await commitSession(session)]],
        }
      );
    }

    return data({ message: usernameResult.error.message }, { status: STATUS_CODES.UNPROCESSABLE_ENTITY });
  }

  return data({}, { status: STATUS_CODES.UNPROCESSABLE_ENTITY });
}

export default ProfileRoute;
