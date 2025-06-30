import * as z from 'zod/v4';
import { API_URL } from './const';
import { LinksSchema, UserSchema } from './schema';
import { appendParams } from '~/utils';
import type { TUser } from '~/types';

const GetUsersResponse = z.object({
  data: z.array(UserSchema),
  meta: z.object({
    itemsPerPage: z.number(),
    currentPage: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
    sortBy: z
      .tuple([UserSchema.keyof(), z.enum(['ASC', 'DESC'])])
      .array()
      .optional(),
    searchBy: UserSchema.keyof().array().optional(),
    search: z.string().optional(),
  }),
  links: LinksSchema,
});

type Params = {
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
      data: {
        users: TUser[];
        totalItems: number;
        totalPages: number;
      };
      error: null;
    }
  | {
      data: null;
      error: { message: string; e: unknown };
    };

export async function getUsers(params?: Params): Promise<Result> {
  const url = new URL(`${API_URL}/users`);
  appendParams(url, params);
  const response = await fetch(url);
  const json = await response.json();
  const { success, data, error } = GetUsersResponse.safeParse(json.data);

  if (success) {
    const users = data.data;
    const { totalItems, totalPages } = data.meta;
    return { data: { users, totalItems, totalPages }, error: null };
  }

  return { error: { message: 'Error parsing server response', e: error }, data: null };
}
