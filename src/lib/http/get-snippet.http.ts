import * as z from 'zod/v4';
import { API_URL } from './const';
import { SnippetSchema, SnippetSchemaWithCodeHighlighted, SnippetSchemaWithLikes } from './schema';
import type { Snippet } from '~/types';

const GetSnippetResponse = SnippetSchema;

type Params = {
  /**
   * ID of the snippet
   */
  id: z.infer<typeof SnippetSchema>['id'] | null;
};

type Result =
  | {
      snippet: Snippet;
      error: null;
    }
  | {
      snippet: null;
      error: ReturnType<typeof GetSnippetResponse.safeParse>['error'];
    };

export async function getSnippet(params: Params): Promise<Result> {
  const id = SnippetSchema.shape.id.parse(params.id);
  const url = new URL(`${API_URL}/snippets/${id}`);
  const response = await fetch(url);
  const json = await response.json();
  const { success, data, error } = GetSnippetResponse.safeParse(json.data);

  if (success) {
    const withCode = await SnippetSchemaWithCodeHighlighted.parseAsync(data);
    return {
      snippet: SnippetSchemaWithLikes.parse(withCode),
      error: null,
    };
  }

  return { error, snippet: null };
}
