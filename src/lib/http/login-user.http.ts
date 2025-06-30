import * as z from 'zod/v4';
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
      user: TUser;
      token: string;
      error: null;
    }
  | {
      user: null;
      error: 'unknown';
    }
  | {
      user: null;
      error: 'server';
      message: string;
      errors: z.infer<typeof EndpointFailureSchema>['errors'];
    };

export async function loginUser(params: Params): Promise<Result> {
  const url = new URL(`${API_URL}/auth/login`);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // todo: remove
    body: JSON.stringify(params),
  });
  const json = await response.json();

  if (response.ok) {
    const responseResult = LoginUserResponse.safeParse(json.data);
    const cookie = response.headers.get('set-cookie');

    if (responseResult.success && cookie) {
      const cookie = response.headers.get('set-cookie');
      const token = cookie.match(new RegExp(`(?:^|; )token=([^;]*)`))?.[1];
      return { user: responseResult.data, error: null, token: token! };
    } else {
      throw new Error('Unexpected server output', responseResult.error);
    }
  }

  const failureResult = EndpointFailureSchema.safeParse(json);

  if (failureResult.success) {
    return { error: 'server', user: null, errors: failureResult.data.errors, message: failureResult.data.message };
  }

  return { error: 'unknown', user: null };
}
