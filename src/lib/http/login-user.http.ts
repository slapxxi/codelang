import {
  ERROR_TYPE_EXCEPTION,
  ERROR_TYPE_SERVER,
  MESSAGE_EXCEPTION,
  MESSAGE_PARSING_ERROR,
  STATUS_CODES,
} from '~/app/const';
import { API_URL } from './const';
import { UserSchema } from './schema';
import type { TResult, TUser } from '~/types';

const LoginUserResponse = UserSchema;

// const existingUser = { username: 'gigauser', password: 'Password12345$' };

type Params = {
  username: string;
  password: string;
};

type Result = TResult<{ user: TUser; token: string; cookie: string }>;

export async function loginUser(params: Params): Promise<Result> {
  try {
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
      const data = LoginUserResponse.parse(json.data);
      const cookie = response.headers.get('set-cookie');

      if (cookie) {
        const cookie = response.headers.get('set-cookie');
        const token = cookie?.match(new RegExp(`(?:^|; )token=([^;]*)`))?.[1];
        return { data: { user: data, token: token!, cookie: cookie! }, error: null };
      }

      return {
        error: { type: ERROR_TYPE_SERVER, message: MESSAGE_PARSING_ERROR, status: STATUS_CODES.SERVER },
        data: null,
      };
    }
    return { error: { type: ERROR_TYPE_SERVER, message: json.message, status: response.status }, data: null };
  } catch (e) {
    return { error: { type: ERROR_TYPE_EXCEPTION, message: MESSAGE_EXCEPTION, e }, data: null };
  }
}
