import * as z from 'zod/v4';
import { API_URL } from './const';
import { SnippetSchema, SnippetSchemaWithLikes } from './schema';
import type { TResult, TSnippet } from '~/types';
import {
  ERROR_TYPE_EXCEPTION,
  ERROR_TYPE_SERVER,
  MESSAGE_EXCEPTION,
  MESSAGE_PARSING_ERROR,
  MESSAGE_RESPONSE_NOT_OK,
  STATUS_SERVER,
} from '~/app/const';

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
        error: { type: ERROR_TYPE_SERVER, message: MESSAGE_PARSING_ERROR, status: response.status },
        data: null,
      };
    }

    return {
      error: { type: ERROR_TYPE_SERVER, message: MESSAGE_RESPONSE_NOT_OK, status: response.status },
      data: null,
    };
  } catch (e) {
    return { error: { type: ERROR_TYPE_EXCEPTION, message: MESSAGE_EXCEPTION, e }, data: null };
  }
}
