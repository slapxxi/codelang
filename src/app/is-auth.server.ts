import { getSession } from '~/app/session.server';

export async function isAuth(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  return session.has('token');
}
