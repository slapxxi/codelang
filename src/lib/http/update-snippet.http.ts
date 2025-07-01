import * as z from 'zod/v4';
import { API_URL } from './const';
import type { TResult, TSnippet } from '~/types';

const UpdateSnippetResponse = z.object({
  updatedCount: z.number(),
});

type Params = {
  id: string;
  token: string;
  language: TSnippet['language'];
  code: TSnippet['code'];
};

type Result = TResult<z.infer<typeof UpdateSnippetResponse>>;

export async function updateSnippet(params: Params): Promise<Result> {
  const url = new URL(`${API_URL}/snippets/${params.id}`);
  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify({ language: params.language, code: params.code }),
    headers: {
      'Content-Type': 'application/json',
      Cookie: `token=${params.token}`,
    },
  });

  if (response.ok) {
    const json = await response.json();
    const { success, data } = UpdateSnippetResponse.safeParse(json.data);
    console.log(response, data);

    if (success) {
      return {
        data,
        error: null,
      };
    }

    return { error: { type: 'server', message: 'Error parsing server response', status: response.status }, data: null };
  }

  return {
    error: { type: 'unknown', message: `Error creating snippet`, e: response.status },
    data: null,
  };
}
