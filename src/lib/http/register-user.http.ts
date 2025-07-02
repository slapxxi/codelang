import { ERROR_TYPE_SERVER, MESSAGE_PARSING_ERROR, MESSAGE_RESPONSE_NOT_OK, STATUS_SERVER } from '~/app/const';
import { API_URL } from './const';
import { UserSchema } from './schema';
import type { TResult, TUser } from '~/types';

const RegisterUserResponse = UserSchema;

type Params = {
  username: string;
  password: string;
};

type Result = TResult<TUser>;

export async function registerUser(params: Params): Promise<Result> {
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
    const responseResult = RegisterUserResponse.safeParse(json.data);

    if (responseResult.success) {
      return {
        data: responseResult.data,
        error: null,
      };
    }

    return { error: { type: ERROR_TYPE_SERVER, message: MESSAGE_PARSING_ERROR, status: STATUS_SERVER }, data: null };
  }

  return { error: { type: ERROR_TYPE_SERVER, message: MESSAGE_RESPONSE_NOT_OK, status: response.status }, data: null };
}
