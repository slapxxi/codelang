import { API_URL } from './const';
import { EndpointFailureSchema, UserSchema } from './schema';
import type { TUser } from '~/types';

const LoginUserResponse = UserSchema;

// const existingUser = { username: 'gigauser', password: 'Password12345$' };

type Params = {
  username: string;
  password: string;
};

type Result =
  | {
      data: {
        user: TUser;
        token: string;
      };
      error: null;
    }
  | {
      data: null;
      error: { message: string; e: unknown };
    };

export async function loginUser(params: Params): Promise<Result> {
  const url = new URL(`${API_URL}/auth/login`);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  const json = await response.json();

  if (response.ok) {
    const responseResult = LoginUserResponse.safeParse(json.data);
    const cookie = response.headers.get('set-cookie');

    if (responseResult.success && cookie) {
      const cookie = response.headers.get('set-cookie');
      const token = cookie?.match(new RegExp(`(?:^|; )token=([^;]*)`))?.[1];
      return { data: { user: responseResult.data, token: token! }, error: null };
    } else {
      throw new Error('Unexpected server output', responseResult.error);
    }
  }

  const failureResult = EndpointFailureSchema.safeParse(json);

  if (failureResult.success) {
    return { error: { message: failureResult.data.message, e: failureResult.data.errors }, data: null };
  }

  return { error: { message: 'Unknown error', e: response.status }, data: null };
}
