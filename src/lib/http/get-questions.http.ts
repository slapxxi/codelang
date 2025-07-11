import * as z from 'zod/v4';
import { ERROR_MESSAGES, ERROR_TYPES } from '~/app/const';
import type { TQuestion, TResult } from '~/types';
import { appendParams } from '~/utils';
import { API_URL } from './const';
import { QuestionSchema, QuestionSchemaWithCodeHighlighted, SnippetSchema, UserSchema } from './schema';

const GetQuestionsResponse = z.object({
  data: QuestionSchema.array(),
  meta: z.object({
    itemsPerPage: z.number(),
    totalItems: z.number(),
    currentPage: z.number(),
    totalPages: z.number(),
    sortBy: z
      .tuple([QuestionSchema.keyof(), z.enum(['ASC', 'DESC'])])
      .array()
      .optional(),
    searchBy: QuestionSchema.keyof().array().optional(),
    search: z.string().optional(),
  }),
  links: z.object({
    first: z.string().optional(),
    previous: z.string().optional(),
    current: z.string().optional(),
    next: z.string().optional(),
    last: z.string().optional(),
  }),
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
  questions: TQuestion[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}>;

export async function getQuestions(params?: Params): Promise<Result> {
  try {
    const url = new URL(`${API_URL}/questions`);
    appendParams(url, params);
    const response = await fetch(url);

    if (response.ok) {
      const json = await response.json();
      const data = GetQuestionsResponse.parse(json.data);
      const questions = await QuestionSchemaWithCodeHighlighted.array().parseAsync(data.data);
      return {
        data: {
          questions,
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
        error: {
          type: ERROR_TYPES.SERVER,
          message: json.message || ERROR_MESSAGES.RESPONSE_NOT_OK,
          status: response.status,
        },
        data: null,
      };
    } catch {
      const body = await response.text();
      return {
        error: { type: ERROR_TYPES.SERVER, message: body || ERROR_MESSAGES.RESPONSE_NOT_OK, status: response.status },
        data: null,
      };
    }
  } catch (e) {
    return { error: { type: ERROR_TYPES.EXCEPTION, message: ERROR_MESSAGES.EXCEPTION, e }, data: null };
  }
}
