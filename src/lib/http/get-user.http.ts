import * as z from 'zod/v4';
import { API_URL } from './const';
import { UserSchema } from './schema';

const GetUsersResponse = UserSchema;

type Params = {
  id: z.infer<typeof UserSchema>['id'] | null;
  /**
   * Page number to retrieve
   * @default 1
   */
  page?: string | number | null;
  /**
   * Number of records per page
   * @default 15
   */
  limit?: string | number | null;
  /**
   * Sort order
   * @default ['username', 'ASC']
   */
  sortBy?: Partial<Record<keyof z.infer<typeof UserSchema>, 'ASC' | 'DESC'>> | null;
  /**
   * Search term to filter results
   */
  search?: string | null;
  /**
   * Fields to search by
   */
  searchBy?: (keyof z.infer<typeof UserSchema>)[] | null;
};

type Result =
  | {
      user: z.infer<typeof UserSchema>;
      error: null;
    }
  | {
      user: null;
      error: ReturnType<typeof GetUsersResponse.safeParse>['error'];
    };

export async function getUser(params: Params): Promise<Result> {
  const id = UserSchema.shape.id.parse(params.id);
  const url = new URL(`${API_URL}/users/${id}`);
  const response = await fetch(url);
  const json = await response.json();
  const { success, data, error } = GetUsersResponse.safeParse(json.data);

  if (success) {
    return { user: data, error: null };
  }

  return { error, user: null };
}
