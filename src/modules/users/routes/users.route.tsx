import type { Route } from './+types/users.route';
import { href, Link } from 'react-router';
import { getUsers } from '~/lib/http';
import { PageTitle, Pagination } from '~/ui';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page');
  const { data, error } = await getUsers({ page });

  if (data) {
    const { users, totalItems, totalPages } = data;
    return { users, totalItems, totalPages, currentPage: page ? parseInt(page) : 1 };
  }

  return { error };
}

const UserRoute = ({ loaderData }: Route.ComponentProps) => {
  const { users, totalPages, currentPage, error } = loaderData;

  if (error) {
    throw new Error(error.message);
  }

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

export default UserRoute;
