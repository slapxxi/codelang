import type { Route } from './+types/profile.route';
import { Await, data, Form, href, redirect } from 'react-router';
import { LogOut, Trash2 } from 'lucide-react';
import { getUserStats } from '~/lib/http/get-user-stats.http';
import { getUserFromSession } from '~/app/get-user-from-session.server';
import { Avatar, FormError, PageTitle, Spinner } from '~/ui';
import { Button } from '~/ui/base';
import { UserStats } from '../ui';
import { urlToSearchParamsRef } from '~/utils';
import { Suspense } from 'react';
import type { TUser } from '~/types';

const ProfileRoute = ({ loaderData }: Route.ComponentProps) => {
  const { user, statsLoader, message } = loaderData;

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
          <Button variant="destructive">
            <Trash2 size={16} />
            <span>Delete Account</span>
          </Button>
        </Form>
      </PageTitle>

      <FormError>{message}</FormError>

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

  const result = { user, message: null, statsLoader: null };
  return data({ ...result, statsLoader: getStats(user) });
}

async function getStats(user: TUser) {
  const result = await getUserStats({ id: user.id });

  if (result.data) {
    return { stats: result.data, message: null };
  }

  return { stats: null, message: result.error.message };
}

export default ProfileRoute;
