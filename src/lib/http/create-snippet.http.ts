import * as z from 'zod/v4';
import { API_URL } from './const';
import type { TResult, TSnippet } from '~/types';
import { SnippetSchema } from './schema';
import {
  ERROR_TYPE_EXCEPTION,
  ERROR_TYPE_SERVER,
  MESSAGE_EXCEPTION,
  MESSAGE_PARSING_ERROR,
  MESSAGE_RESPONSE_NOT_OK,
} from '~/app/const';

const CreateSnippetResponse = SnippetSchema.omit({ marks: true, comments: true });

type Params = {
  token: string;
  language: TSnippet['language'];
  code: TSnippet['code'];
};

type Result = TResult<z.infer<typeof CreateSnippetResponse>>;

export async function createSnippet(params: Params): Promise<Result> {
  try {
    const url = new URL(`${API_URL}/snippets`);
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ language: params.language, code: params.code }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${params.token}`,
      },
    });

    if (response.ok) {
      const json = await response.json();
      const { success, data } = CreateSnippetResponse.safeParse(json.data);

      if (success) {
        return {
          data,
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
