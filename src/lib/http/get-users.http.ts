import * as z from 'zod/v4';
import { ERROR_MESSAGES, ERROR_TYPES } from '~/app/const';
import type { TResult, TUser } from '~/types';
import { appendParams } from '~/utils';
import { API_URL } from './const';
import { LinksSchema, UserSchema } from './schema';

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

type Result = TResult<{
  users: TUser[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}>;

export async function getUsers(params?: Params): Promise<Result> {
  try {
    const url = new URL(`${API_URL}/users`);
    appendParams(url, params);
    const response = await fetch(url);

    if (response.ok) {
      const json = await response.json();
      const data = GetUsersResponse.parse(json.data);
      const users = data.data;
      const { totalItems, totalPages, currentPage } = data.meta;
      return { data: { users, totalItems, totalPages, currentPage }, error: null };
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
      return { error: { type: ERROR_TYPES.SERVER, message: body, status: response.status }, data: null };
    }
  } catch (e) {
    return { error: { type: ERROR_TYPES.EXCEPTION, message: 'Error getting users', e }, data: null };
  }
}
