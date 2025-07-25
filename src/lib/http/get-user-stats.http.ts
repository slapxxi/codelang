import { ERROR_MESSAGES, ERROR_TYPES } from '~/app/const';
import type { TResult, TUserStats } from '~/types';
import { API_URL } from './const';
import { UserStatsSchema } from './schema';

const GetUserStatsResponse = UserStatsSchema;

type Params = {
  id: string;
};

type Result = TResult<TUserStats>;

export async function getUserStats(params: Params): Promise<Result> {
  try {
    const url = new URL(`${API_URL}/users/${params.id}/statistic`);
    const response = await fetch(url);

    if (response.ok) {
      const json = await response.json();
      const data = GetUserStatsResponse.parse(json.data);
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
        error: { type: ERROR_TYPES.SERVER, message: body, status: response.status },
        data: null,
      };
    }
  } catch (e) {
    return { error: { type: ERROR_TYPES.EXCEPTION, message: 'Error getting user stats', e }, data: null };
  }
}
