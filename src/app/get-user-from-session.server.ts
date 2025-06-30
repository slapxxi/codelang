import { getSession } from '~/app/session.server';
import { getCurrentUser } from '~/lib/http';

export async function getUserFromSession(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('token');

  if (token) {
    const { data } = await getCurrentUser({ token: token });

    if (data) {
      return data;
    }
  }

  return null;
}
