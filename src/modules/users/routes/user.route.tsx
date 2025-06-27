import type { Route } from './+types/user.route.tsx';

export async function loader({ params }) {
  const user = { id: params.userId };
  return { user };
}

const UserRoute = ({ loaderData }: Route.DataArgs) => {
  const { user } = loaderData;
  return <h1>User {user.id}</h1>;
};

export default UserRoute;
