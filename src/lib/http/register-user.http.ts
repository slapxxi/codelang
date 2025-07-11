import { ERROR_MESSAGES, ERROR_TYPES } from '~/app/const';
import type { TResult, TUser } from '~/types';
import { API_URL } from './const';
import { UserSchema } from './schema';

const RegisterUserResponse = UserSchema;

type Params = {
  username: string;
  password: string;
};

type Result = TResult<TUser>;

export async function registerUser(params: Params): Promise<Result> {
  try {
    const url = new URL(`${API_URL}/register`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (response.ok) {
      const json = await response.json();
      const data = RegisterUserResponse.parse(json.data);
      return { data, error: null };
    }

    try {
      const json = await response.clone().json();
      return {
        error: {
          type: ERROR_TYPES.SERVER,
          message: json.message || ERROR_MESSAGES.RESPONSE_NOT_OK,
          status: response.status,
        },
        data: null,
      };
    } catch {
      const body = await response.text();
      return {
        error: { type: ERROR_TYPES.SERVER, message: body || ERROR_MESSAGES.RESPONSE_NOT_OK, status: response.status },
        data: null,
      };
    }
  } catch (e) {
    return { error: { type: ERROR_TYPES.EXCEPTION, message: ERROR_MESSAGES.EXCEPTION, e }, data: null };
  }
}
