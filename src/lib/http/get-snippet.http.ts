import * as z from 'zod/v4';
import { API_URL } from './const';
import { SnippetSchema, SnippetSchemaWithLikes } from './schema';
import type { TResult, TSnippet } from '~/types';
import { SERVER_ERROR } from '~/app/const';

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
    const json = await response.json();
    const { success, data } = GetSnippetResponse.safeParse(json.data);

    if (success) {
      return {
        data: await SnippetSchemaWithLikes.parseAsync(data),
        error: null,
      };
    }

    return { error: { type: 'server', message: 'Error parsing server response', status: SERVER_ERROR }, data: null };
  } catch (e) {
    return { error: { type: 'exception', message: 'Exception occured', e }, data: null };
  }
}
