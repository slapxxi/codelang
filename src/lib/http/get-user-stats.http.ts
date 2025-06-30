import * as z from 'zod/v4';
import { API_URL } from './const';
import { UserStatsSchema } from './schema';

const GetUserStatsResponse = UserStatsSchema;

type Params = {
  id: string;
};

type Result =
  | {
      data: z.infer<typeof UserStatsSchema>;
      error: null;
    }
  | {
      data: null;
      error: { message: string; e: unknown };
    };

export async function getUserStats(params: Params): Promise<Result> {
  const url = new URL(`${API_URL}/users/${params.id}/statistic`);
  const response = await fetch(url);
  const json = await response.json();
  const { success, data, error } = GetUserStatsResponse.safeParse(json.data);

  if (success) {
    return { data, error: null };
  }

  return { error: { message: 'Error parsing server response', e: error }, data: null };
}
