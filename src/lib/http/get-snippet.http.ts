import * as z from 'zod/v4';
import { API_URL } from './const';
import { SnippetSchema, SnippetSchemaWithLikes } from './schema';
import type { TSnippet } from '~/types';

const GetSnippetResponse = SnippetSchema;

type Params = {
  id: z.infer<typeof SnippetSchema>['id'] | null;
};

type Result =
  | {
      data: TSnippet;
      error: null;
    }
  | {
      data: null;
      error: { message: string; e: unknown };
    };

export async function getSnippet(params: Params): Promise<Result> {
  const id = SnippetSchema.shape.id.parse(params.id);
  const url = new URL(`${API_URL}/snippets/${id}`);
  const response = await fetch(url);
  const json = await response.json();
  const { success, data, error } = GetSnippetResponse.safeParse(json.data);

  if (success) {
    return {
      data: await SnippetSchemaWithLikes.parseAsync(data),
      error: null,
    };
  }

  return { error: { message: 'Error parsing server response', e: error }, data: null };
}
