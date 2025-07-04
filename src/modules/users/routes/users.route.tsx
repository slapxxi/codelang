import type { Route } from './+types/users.route';
import { data, href, Link } from 'react-router';
import { STATUS_NOT_FOUND } from '~/app/const';
import { getUsers } from '~/lib/http';
import { Avatar, Card, PageTitle, Pagination } from '~/ui';

const UserRoute = ({ loaderData }: Route.ComponentProps) => {
  const { users, totalPages, currentPage } = loaderData;

  return (
    <div className="flex flex-col w-full">
      <PageTitle className="mb-4">Users</PageTitle>

      <ul className="flex flex-col gap-2 md:grid grid-cols-3">
        {users.map((u) => (
          <Card asChild key={u.id} variant="interactive">
            <Link to={href('/users/:userId', { userId: u.id })} className="p-2 flex gap-2 items-center">
              <Avatar user={u} />
              <span>{u.username}</span>
            </Link>
          </Card>
        ))}
      </ul>

      <Pagination numberOfPages={totalPages} currentPage={currentPage} maxDisplayed={10} className="my-4" />
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
