import { Avatar } from '~/ui';
import type { Route } from './+types/user.route';
import { getUser } from '~/lib/http';

export async function loader({ params }: Route.LoaderArgs) {
  const { user, error } = await getUser({ id: params.userId });
  return { user, error };
}

const UserRoute = ({ loaderData }: Route.ComponentProps) => {
  const { user, error } = loaderData;

  if (error) {
    return null;
  }

  return (
    <div>
      <Avatar />
      <h1>User {user.id}</h1>
    </div>
  );
};

export default UserRoute;
