import { ERROR_MESSAGES, ERROR_TYPES, STATUS_CODES } from '~/app/const';
import type { TResult, TUser } from '~/types';
import { API_URL } from './const';
import { UserSchema } from './schema';

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
        error: { type: ERROR_TYPES.SERVER, message: ERROR_MESSAGES.PARSING_ERROR, status: STATUS_CODES.SERVER },
        data: null,
      };
    }
    return { error: { type: ERROR_TYPES.SERVER, message: json.message, status: response.status }, data: null };
  } catch (e) {
    return { error: { type: ERROR_TYPES.EXCEPTION, message: ERROR_MESSAGES.EXCEPTION, e }, data: null };
  }
}
