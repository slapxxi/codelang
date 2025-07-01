import * as z from 'zod/v4';
import { API_URL } from './const';
import type { TResult, TSnippet } from '~/types';
import { SnippetSchema } from './schema';

const CreateSnippetResponse = SnippetSchema.omit({ marks: true, comments: true });

type Params = {
  token: string;
  language: TSnippet['language'];
  code: TSnippet['code'];
};

type Result = TResult<z.infer<typeof CreateSnippetResponse>>;

export async function createSnippet(params: Params): Promise<Result> {
  const url = new URL(`${API_URL}/snippets`);
  const response = await fetch(url, {
    method: 'post',
    body: JSON.stringify({ language: params.language, code: params.code }),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `token=${params.token}`,
    },
  });

  if (response.ok) {
    const json = await response.json();
    const { success, data, error } = CreateSnippetResponse.safeParse(json.data);
    if (success) {
      return {
        data,
        error: null,
      };
    }

    return { error: { message: 'Error parsing server response', e: error }, data: null };
  }

  console.log(response);
  return { error: { message: `Error marking snippet: ${params.mark}`, e: response.status }, data: null };
}
