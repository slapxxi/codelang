import { API_URL } from './const';
import { UserSchema } from './schema';
import type { TUser } from '~/types';

const GetCurrentUserResponse = UserSchema;

type Params = {
  token: string;
};

type Result =
  | {
      data: TUser;
      error: null;
    }
  | {
      data: null;
      error: { message: string; e: unknown };
    };

export async function getCurrentUser(params: Params): Promise<Result> {
  const url = new URL(`${API_URL}/auth`);
  const response = await fetch(url, {
    method: 'get',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `token=${params.token}`,
    },
  });

  if (response.ok) {
    const json = await response.json();
    const { success, data, error } = GetCurrentUserResponse.safeParse(json.data);
    if (success) {
      return {
        data,
        error: null,
      };
    }

    return { error: { message: 'Error parsing server response', e: error }, data: null };
  }

  return { error: { message: 'Error getting current user', e: response.status }, data: null };
}
