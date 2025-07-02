import { Avatar, PageTitle } from '~/ui';
import type { Route } from './+types/user.route';
import { getUserStats } from '~/lib/http/get-user-stats.http';
import { data } from 'react-router';
import { STATUS_NOT_FOUND } from '~/app/const';
import { UserStats } from '../ui';

const UserRoute = ({ loaderData }: Route.ComponentProps) => {
  const { stats } = loaderData;

  if (stats) {
    return (
      <div className="w-full flex flex-col gap-4">
        <PageTitle className="flex items-center gap-2">
          <Avatar />
          <span>{stats.username}</span>
        </PageTitle>

        <UserStats stats={stats} />
      </div>
    );
  }

  return null;
};

export async function loader({ params }: Route.LoaderArgs) {
  const userStatsResult = await getUserStats({ id: params.userId });

  if (userStatsResult.data) {
    return { stats: userStatsResult.data };
  }

  throw data(null, { status: STATUS_NOT_FOUND });
}

export default UserRoute;
