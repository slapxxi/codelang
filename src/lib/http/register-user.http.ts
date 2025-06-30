import { API_URL } from './const';
import { EndpointFailureSchema, UserSchema } from './schema';
import type { TUser } from '~/types';

const RegisterUserResponse = UserSchema;

type Params = {
  username: string;
  password: string;
};

type Result =
  | {
      data: TUser;
      error: null;
    }
  | {
      data: null;
      error: { type: 'server' | 'unknown'; message: string; e: unknown };
    };

export async function registerUser(params: Params): Promise<Result> {
  const url = new URL(`${API_URL}/register`);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  const json = await response.json();
  const responseResult = RegisterUserResponse.safeParse(json.data);

  if (responseResult.success) {
    return {
      data: responseResult.data,
      error: null,
    };
  }

  const failureResult = EndpointFailureSchema.safeParse(json);

  if (failureResult.success) {
    return { error: { type: 'server', message: 'server', e: failureResult.data.errors }, data: null };
  }

  return { error: { type: 'unknown', message: 'Unknown error', e: response.status }, data: null };
}
