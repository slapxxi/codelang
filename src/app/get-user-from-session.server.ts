import { getSession } from '~/app/session.server';

export async function getUserFromSession(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  const user = session.get('user');
  return user ?? null;
}
