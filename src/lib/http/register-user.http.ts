import * as z from 'zod/v4';
import { API_URL } from './const';
import { SnippetSchema, UserSchema, SnippetSchemaWithLikes, LinksSchema } from './schema';
import { appendParams } from '~/utils';
import type { Snippet } from '~/types';

const RegisterUserResponse = z.object({
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
  username: string;
  password: string;
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

type Result =
  | {
      snippets: Snippet[];
      totalItems: number;
      totalPages: number;
      error?: z.ZodError[];
    }
  | {
      snippets: null;
      totalItems: null;
      totalPages: null;
      error?: ReturnType<typeof RegisterUserResponse.safeParse>['error'];
    };

export async function registerUser(params?: Params): Promise<Result> {
  const url = new URL(`${API_URL}/snippets`);
  appendParams(url, params);
  const response = await fetch(url);
  const json = await response.json();
  const { success, data, error } = RegisterUserResponse.safeParse(json.data);

  if (success) {
    return {
      snippets: SnippetSchemaWithLikes.array().parse(data.data),
      totalItems: data.meta.totalItems,
      totalPages: data.meta.totalPages,
    };
  }

  return { error, snippets: null, totalItems: null, totalPages: null };
}
