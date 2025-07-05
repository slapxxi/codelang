import { API_URL } from './const';
import { UserStatsSchema } from './schema';
import type { TResult, TUserStats } from '~/types';
import { ERROR_TYPE_EXCEPTION, ERROR_TYPE_SERVER } from '~/app/const';

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
        error: { type: ERROR_TYPE_SERVER, message: json.message, status: response.status },
        data: null,
      };
    } catch {
      const body = await response.text();
      return {
        error: { type: ERROR_TYPE_SERVER, message: body, status: response.status },
        data: null,
      };
    }
  } catch (e) {
    return { error: { type: ERROR_TYPE_EXCEPTION, message: 'Error getting user stats', e }, data: null };
  }
}
