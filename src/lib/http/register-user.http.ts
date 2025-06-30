import * as z from 'zod/v4';
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
      user: TUser;
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
      user: responseResult.data,
      error: null,
    };
  }

  const failureResult = EndpointFailureSchema.safeParse(json);

  if (failureResult.success) {
    return { error: 'server', user: null, errors: failureResult.data.errors, message: failureResult.data.message };
  }

  return { error: 'unknown', user: null };
}
