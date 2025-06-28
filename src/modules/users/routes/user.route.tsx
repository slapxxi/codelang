import { Avatar } from '~/ui';
import type { Route } from './+types/user.route.tsx';
import { getUser } from '~/lib/http';

export async function loader({ params }: Route.LoaderArgs) {
  const { user, error } = await getUser({ id: params.userId });
  return { user };
}

const UserRoute = ({ loaderData }: Route.DataArgs) => {
  const { user } = loaderData;

  return (
    <div>
      <Avatar />
      <h1>User {user.id}</h1>
    </div>
  );
};

export default UserRoute;
