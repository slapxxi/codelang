import * as z from 'zod/v4';
import { API_URL } from './const';
import type { TResult } from '~/types';
import { ERROR_TYPE_EXCEPTION, ERROR_TYPE_SERVER } from '~/app/const';

const ChangePasswordResponse = z.object({
  updatedCount: z.number(),
});

type Params = {
  oldPassword: string;
  newPassword: string;
  token: string;
};

type Result = TResult<z.infer<typeof ChangePasswordResponse>>;

export async function changePassword(params: Params): Promise<Result> {
  try {
    const url = new URL(`${API_URL}/me/password`);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: `token=${params.token}` },
      body: JSON.stringify({ oldPassword: params.oldPassword, newPassword: params.newPassword }),
    });

    if (response.ok) {
      const json = await response.json();
      const data = ChangePasswordResponse.parse(json.data);
      return { data, error: null };
    }

    try {
      const json = await response.clone().json();
      return { error: { type: ERROR_TYPE_SERVER, message: json.message, status: response.status }, data: null };
    } catch (e) {
      const body = await response.text();
      return { error: { type: ERROR_TYPE_SERVER, message: body, status: response.status }, data: null };
    }
  } catch (e) {
    return { error: { type: ERROR_TYPE_EXCEPTION, message: 'Error changing password', e }, data: null };
  }
}
