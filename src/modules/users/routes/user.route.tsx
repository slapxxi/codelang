import { Avatar, PageTitle } from '~/ui';
import type { Route } from './+types/user.route';
import { getUserStats } from '~/lib/http/get-user-stats.http';
import { UserStats } from '../ui';

export async function loader({ params }: Route.LoaderArgs) {
  const { data, error } = await getUserStats({ id: params.userId });

  if (data) {
    return { stats: data };
  }

  return { error };
}

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

export default UserRoute;
