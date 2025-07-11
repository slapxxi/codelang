import * as z from 'zod/v4';
import { ERROR_MESSAGES, ERROR_TYPES } from '~/app/const';
import type { TResult, TSnippet } from '~/types';
import { API_URL } from './const';

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
  try {
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

      if (success) {
        return {
          data,
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
    return {
      error: { type: ERROR_TYPES.EXCEPTION, message: `Error creating snippet`, e },
      data: null,
    };
  }
}
