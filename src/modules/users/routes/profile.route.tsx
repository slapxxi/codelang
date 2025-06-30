import type { Route } from './+types/profile.route';
import { Form, href, redirect } from 'react-router';
import { LogOut } from 'lucide-react';
import { getUserStats } from '~/lib/http/get-user-stats.http';
import { getUserFromSession } from '~/app/get-user-from-session.server';
import { Avatar, PageTitle } from '~/ui';
import { Button } from '~/ui/base';
import { UserStats } from '../ui';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUserFromSession(request);

  if (user === null) {
    return redirect('/login');
  }

  const { data, error } = await getUserStats({ id: user.id });

  if (data) {
    return { stats: data };
  }

  return { error };
}

const ProfileRoute = ({ loaderData }: Route.ComponentProps) => {
  const { stats } = loaderData;

  if (stats) {
    return (
      <div className="w-full flex flex-col gap-4">
        <PageTitle className="flex items-center gap-2">
          <Avatar />
          <span>{stats.username}</span>
        </PageTitle>

        <Form action={href('/logout')} method="post">
          <Button>
            Logout <LogOut />
          </Button>
        </Form>

        <UserStats stats={stats} />
      </div>
    );
  }

  return null;
};

export default ProfileRoute;
