import { API_URL } from './const';
import { UserStatsSchema } from './schema';
import type { TResult, TUserStats } from '~/types';
import { ERROR_TYPE_EXCEPTION, ERROR_TYPE_SERVER, MESSAGE_PARSING_ERROR, MESSAGE_RESPONSE_NOT_OK } from '~/app/const';

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
      const { success, data } = GetUserStatsResponse.safeParse(json.data);

      if (success) {
        return { data, error: null };
      }

      return {
        error: { type: ERROR_TYPE_SERVER, message: MESSAGE_PARSING_ERROR, status: response.status },
        data: null,
      };
    }

    return {
      error: { type: ERROR_TYPE_SERVER, message: MESSAGE_RESPONSE_NOT_OK, status: response.status },
      data: null,
    };
  } catch (e) {
    return { error: { type: ERROR_TYPE_EXCEPTION, message: 'Error getting user stats', e }, data: null };
  }
}
