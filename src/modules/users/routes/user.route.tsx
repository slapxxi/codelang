import { data } from 'react-router';
import { ERROR_TYPE_SERVER, STATUS_CODES } from '~/app/const';
import { getUserStats } from '~/lib/http/get-user-stats.http';
import type { TUserStats } from '~/types';
import { Avatar, FormError, PageTitle } from '~/ui';
import { UserStats } from '../ui';
import type { Route } from './+types/user.route';

const UserRoute = ({ loaderData }: Route.ComponentProps) => {
  const { stats, errorMessage } = loaderData;

  if (stats) {
    return (
      <div className="flex w-full flex-col gap-4">
        <PageTitle className="flex items-center gap-2">
          <Avatar />
          <span>{stats.username}</span>
        </PageTitle>

        <UserStats stats={stats} />
      </div>
    );
  }

  return <FormError>{errorMessage}</FormError>;
};

type LoaderResult = {
  stats?: TUserStats;
  errorMessage?: string;
};

export async function loader({ params }: Route.LoaderArgs) {
  const result: LoaderResult = { stats: undefined };
  const userStatsResult = await getUserStats({ id: params.userId });

  if (userStatsResult.data) {
    return { ...result, stats: userStatsResult.data } as LoaderResult;
  }

  const { error } = userStatsResult;
  return data({ ...result, errorMessage: error.message } as LoaderResult, {
    status: error.type === ERROR_TYPE_SERVER ? error.status : STATUS_CODES.NOT_FOUND,
  });
}

export default UserRoute;
