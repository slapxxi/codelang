import * as z from 'zod/v4';
import { API_URL } from './const';
import { SnippetSchema, UserSchema, SnippetSchemaWithLikes, LinksSchema } from './schema';
import { appendParams } from '~/utils';
import type { TResult, TSnippet } from '~/types';
import { ERROR_TYPE_EXCEPTION, ERROR_TYPE_SERVER, MESSAGE_RESPONSE_NOT_OK } from '~/app/const';

const GetSnippetsResponse = z.object({
  data: z.array(SnippetSchema),
  meta: z.object({
    itemsPerPage: z.number(),
    currentPage: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
    sortBy: z
      .tuple([SnippetSchema.keyof(), z.enum(['ASC', 'DESC'])])
      .array()
      .optional(),
    searchBy: SnippetSchema.keyof().array().optional(),
    search: z.string().optional(),
  }),
  links: LinksSchema,
});

type Params = {
  /**
   * ID of the snippet owner
   */
  userId?: z.infer<typeof UserSchema>['id'] | null;
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
  sortBy?: Partial<Record<keyof z.infer<typeof SnippetSchema>, 'ASC' | 'DESC'>> | null;
  /**
   * Search term to filter results
   */
  search?: string | null;
  /**
   * Fields to search by
   */
  searchBy?: (keyof z.infer<typeof SnippetSchema>)[] | null;
};

type Result = TResult<{
  snippets: TSnippet[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}>;

export async function getSnippets(params?: Params): Promise<Result> {
  try {
    const url = new URL(`${API_URL}/snippets`);
    appendParams(url, params);
    const response = await fetch(url);

    if (response.ok) {
      const json = await response.json();
      const data = GetSnippetsResponse.parse(json.data);

      return {
        data: {
          snippets: await SnippetSchemaWithLikes.array().parseAsync(data.data),
          totalItems: data.meta.totalItems,
          totalPages: data.meta.totalPages,
          currentPage: data.meta.currentPage,
        },
        error: null,
      };
    }

    try {
      const json = await response.clone().json();
      return {
        error: { type: ERROR_TYPE_SERVER, message: json.message || MESSAGE_RESPONSE_NOT_OK, status: response.status },
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
    return { error: { type: ERROR_TYPE_EXCEPTION, message: 'Error getting snippets', e }, data: null };
  }
}
