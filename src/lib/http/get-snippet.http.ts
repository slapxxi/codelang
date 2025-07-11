import * as z from 'zod/v4';
import { ERROR_MESSAGES, ERROR_TYPES } from '~/app/const';
import type { TResult, TSnippet } from '~/types';
import { API_URL } from './const';
import { SnippetSchema, SnippetSchemaWithLikes } from './schema';

const GetSnippetResponse = SnippetSchema;

type Params = {
  id: z.infer<typeof SnippetSchema>['id'] | null;
};

type Result = TResult<TSnippet>;

export async function getSnippet(params: Params): Promise<Result> {
  try {
    const id = SnippetSchema.shape.id.parse(params.id);
    const url = new URL(`${API_URL}/snippets/${id}`);
    const response = await fetch(url);

    if (response.ok) {
      const json = await response.json();
      const { success, data } = GetSnippetResponse.safeParse(json.data);

      if (success) {
        return {
          data: await SnippetSchemaWithLikes.parseAsync(data),
          error: null,
        };
      }

      return {
        error: { type: ERROR_TYPES.SERVER, message: ERROR_MESSAGES.PARSING_ERROR, status: response.status },
        data: null,
      };
    }

    return {
      error: { type: ERROR_TYPES.SERVER, message: ERROR_MESSAGES.RESPONSE_NOT_OK, status: response.status },
      data: null,
    };
  } catch (e) {
    return { error: { type: ERROR_TYPES.EXCEPTION, message: ERROR_MESSAGES.EXCEPTION, e }, data: null };
  }
}
