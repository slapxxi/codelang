import type { Route } from './+types/users.route';
import { data, href, Link } from 'react-router';
import { STATUS_NOT_FOUND } from '~/app/const';
import { getUsers } from '~/lib/http';
import { PageTitle, Pagination } from '~/ui';

const UserRoute = ({ loaderData }: Route.ComponentProps) => {
  const { users, totalPages, currentPage } = loaderData;

  return (
    <div className="flex flex-col">
      <PageTitle>Users</PageTitle>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            <Link to={href('/users/:userId', { userId: u.id })}>{u.username}</Link>
          </li>
        ))}
      </ul>
      <Pagination numberOfPages={totalPages} currentPage={currentPage} maxDisplayed={10} />
    </div>
  );
};

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page');
  const usersResult = await getUsers({ page });

  if (usersResult.data) {
    const { users, totalItems, totalPages } = usersResult.data;
    return { users, totalItems, totalPages, currentPage: page ? parseInt(page) : 1 };
  }

  throw data(null, { status: STATUS_NOT_FOUND });
}

export default UserRoute;
