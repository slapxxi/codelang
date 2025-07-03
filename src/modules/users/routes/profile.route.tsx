import type { Route } from './+types/profile.route';
import { data, Form, href, redirect } from 'react-router';
import { LogOut } from 'lucide-react';
import { getUserStats } from '~/lib/http/get-user-stats.http';
import { getUserFromSession } from '~/app/get-user-from-session.server';
import { Avatar, PageTitle } from '~/ui';
import { Button } from '~/ui/base';
import { UserStats } from '../ui';
import { STATUS_NOT_FOUND, STATUS_SERVER, STATUS_UNAUTHORIZED } from '~/app/const';

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

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUserFromSession(request);

  if (user === null) {
    return redirect('/login', { status: STATUS_UNAUTHORIZED });
  }

  const userStatsResult = await getUserStats({ id: user.id });

  if (userStatsResult.data) {
    return { stats: userStatsResult.data };
  }

  throw data(null, { status: STATUS_SERVER });
}

export default ProfileRoute;
