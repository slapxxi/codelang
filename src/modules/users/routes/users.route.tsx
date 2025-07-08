import { data, href, NavLink } from 'react-router';
import { STATUS_NOT_FOUND } from '~/app/const';
import { getUsers } from '~/lib/http';
import type { TUser } from '~/types';
import { Avatar, Card, PageTitle, Pagination, Spinner } from '~/ui';
import type { Route } from './+types/users.route';

const UserRoute = ({ loaderData }: Route.ComponentProps) => {
  const { users, totalPages, currentPage } = loaderData;

  return (
    <div className="@container flex w-full flex-col">
      <PageTitle className="mb-4">Users</PageTitle>

      <ul className="flex grid-cols-3 flex-col gap-2 md:grid @max-3xl:grid-cols-2">
        {users.map((u) => (
          <Card asChild key={u.id} variant="interactive">
            <NavLink to={href('/users/:userId', { userId: u.id })} className="flex items-center gap-2 p-2">
              {({ isPending }) => (
                <>
                  <Avatar user={u} />
                  <span>{u.username}</span>
                  {isPending && <Spinner className="ml-auto text-olive-600" />}
                </>
              )}
            </NavLink>
          </Card>
        ))}
      </ul>

      <Pagination numberOfPages={totalPages} currentPage={currentPage} maxDisplayed={10} className="my-4" />
    </div>
  );
};

type LoaderResult = {
  users: TUser[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
};

export async function loader({ request }: Route.LoaderArgs): Promise<LoaderResult> {
  const url = new URL(request.url);
  const page = url.searchParams.get('page');
  const usersResult = await getUsers({ page });

  if (usersResult.data) {
    const { users, totalItems, totalPages, currentPage } = usersResult.data;
    return { users, totalItems, totalPages, currentPage };
  }

  throw data(null, { status: STATUS_NOT_FOUND });
}

export default UserRoute;
