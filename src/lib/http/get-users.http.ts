import * as z from 'zod/v4';
import { API_URL } from './const';
import { User } from './schema';

const UsersResponse = z.object({
  data: z.array(User),
  meta: z.object({
    itemsPerPage: z.number(),
    currentPage: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
    sortBy: z
      .tuple([User.keyof(), z.enum(['ASC', 'DESC'])])
      .array()
      .optional(),
    searchBy: User.keyof().array().optional(),
    search: z.string().optional(),
  }),
  links: z.object({ current: z.string() }),
});

type RequestParams = {
  /**
   * Page number to retrieve
   * @default 1
   */
  page?: number;
  /**
   * Number of records per page
   * @default 15
   */
  limit?: number;
  /**
   * Sort order
   * @default ['username', 'ASC']
   */
  sortBy?: Partial<Record<keyof z.infer<typeof User>, 'ASC' | 'DESC'>>;
  /**
   * Search term to filter results
   */
  search?: string;
  /**
   * Fields to search by
   */
  searchBy?: (keyof z.infer<typeof User>)[];
};

type Params = RequestParams;

export async function getUsers(params?: Params): Promise<z.infer<typeof User>[]> {
  const url = new URL(`${API_URL}/users`);
  appendParams(url, params);
  const response = await fetch(url);
  const json = await response.json();
  const { data } = UsersResponse.parse(json.data);
  return data;
}

function appendParams(url: URL, params?: Params) {
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        for (const v of value) {
          url.searchParams.append(key, String(v));
        }
        continue;
      }
      if (typeof value === 'object') {
        for (const [k, v] of Object.entries(value)) {
          url.searchParams.append(key, `${k}:${v}`);
        }
        continue;
      }
      url.searchParams.append(key, String(value));
    }
  }
}
