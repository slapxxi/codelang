import * as z from 'zod/v4';
import { API_URL } from './const';
import {
  SnippetSchema,
  UserSchema,
  SnippetSchemaWithLikes,
  LinksSchema,
  SnippetSchemaWithCodeHighlighted,
} from './schema';
import { appendParams } from '~/utils';
import type { Snippet } from '~/types';

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

type Result =
  | {
      data: {
        snippets: Snippet[];
        totalItems: number;
        totalPages: number;
      };
      error: null;
    }
  | {
      data: null;
      error: { message: string };
    };

export async function getSnippets(params?: Params): Promise<Result> {
  const url = new URL(`${API_URL}/snippets`);
  appendParams(url, params);
  const response = await fetch(url);
  const json = await response.json();
  const { success, data, error } = GetSnippetsResponse.safeParse(json.data);

  if (success) {
    const withCode = await SnippetSchemaWithCodeHighlighted.array().parseAsync(data.data);
    return {
      data: {
        snippets: SnippetSchemaWithLikes.array().parse(withCode),
        totalItems: data.meta.totalItems,
        totalPages: data.meta.totalPages,
      },
      error: null,
    };
  }

  return { error, data: null };
}
