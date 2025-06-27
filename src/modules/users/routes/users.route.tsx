import { Outlet } from 'react-router';
import { getUsers } from '~/lib/http';

export async function loader() {
  const users = await getUsers();
  return { users };
}

const UserRoute = () => {
  return (
    <>
      <h1>Users</h1>
      <Outlet />
    </>
  );
};

export default UserRoute;
