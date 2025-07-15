import * as z from 'zod/v4';
import { API_URL } from './const';
import { SnippetSchema } from './schema';

const MarkSnippetResponse = z.object({ mark: z.enum(['like', 'dislike', 'none']) });

type Params = {
  id: string;
  token: string;
  mark: 'like' | 'dislike' | 'none';
};

type Result =
  | {
      data: z.infer<typeof MarkSnippetResponse>;
      error: null;
    }
  | {
      data: null;
      error: { message: string; e: unknown };
    };

export async function markSnippet(params: Params): Promise<Result> {
  const id = SnippetSchema.shape.id.parse(params.id);
  const url = new URL(`${API_URL}/snippets/${id}/mark`);
  const response = await fetch(url, {
    method: 'post',
    body: JSON.stringify({ mark: params.mark }),
    headers: {
      'Content-Type': 'application/json',
      Cookie: `token=${params.token}`,
    },
  });

  if (response.ok) {
    const json = await response.json();
    const { success, data, error } = MarkSnippetResponse.safeParse(json.data);
    if (success) {
      return {
        data,
        error: null,
      };
    }

    return { error: { message: 'Error parsing server response', e: error }, data: null };
  }

  return { error: { message: `Error marking snippet: ${params.mark}`, e: response.status }, data: null };
}
