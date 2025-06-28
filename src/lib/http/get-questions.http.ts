import * as z from 'zod/v4';
import { API_URL } from './const';
import { SnippetSchema, UserSchema, QuestionSchema, QuestionSchemaWithCodeHighlighted } from './schema';
import { appendParams } from '~/utils';
import type { Question } from '~/types';

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

type Result =
  | {
      questions: Question[];
      totalItems: number;
      totalPages: number;
      error: null;
    }
  | {
      questions: null;
      totalItems: null;
      totalPages: null;
      error: ReturnType<typeof GetQuestionsResponse.safeParse>['error'];
    };

export async function getQuestions(params?: Params): Promise<Result> {
  const url = new URL(`${API_URL}/questions`);
  appendParams(url, params);
  const response = await fetch(url);
  const json = await response.json();
  const { success, data, error } = GetQuestionsResponse.safeParse(json.data);

  if (success) {
    const questions = await QuestionSchemaWithCodeHighlighted.array().parseAsync(data.data);
    return {
      questions,
      totalItems: data.meta.totalItems,
      totalPages: data.meta.totalPages,
      error: null,
    };
  }

  return { error, questions: null, totalItems: null, totalPages: null };
}
