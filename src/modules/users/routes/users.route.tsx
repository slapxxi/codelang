import { Outlet } from 'react-router';

const UserRoute = () => {
  return (
    <>
      <h1>Users</h1>
      <Outlet />
    </>
  );
};

export default UserRoute;
