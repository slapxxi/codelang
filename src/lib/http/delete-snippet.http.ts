import * as z from 'zod/v4';
import { ERROR_MESSAGES, ERROR_TYPES } from '~/app/const';
import type { TResult } from '~/types';
import { API_URL } from './const';
import { SnippetSchema } from './schema';

const DeleteSnippetResponse = z.object({
  ...SnippetSchema.omit({ id: true, marks: true, comments: true }).shape,
  likesCount: z.number(),
  dislikesCount: z.number(),
  commentsCount: z.number(),
  isLikedByUser: z.number(),
  isDislikedByUser: z.number(),
});

type Params = {
  id: string;
  token: string;
};

type Result = TResult<z.infer<typeof DeleteSnippetResponse>>;

export async function deleteSnippet(params: Params): Promise<Result> {
  try {
    const url = new URL(`${API_URL}/snippets/${params.id}`);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${params.token}`,
      },
    });

    if (response.ok) {
      const json = await response.json();
      const { success, data } = DeleteSnippetResponse.safeParse(json.data);

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
      error: { type: ERROR_TYPES.SERVER, message: `Error deleting snippet`, status: response.status },
      data: null,
    };
  } catch (e) {
    return { error: { type: ERROR_TYPES.EXCEPTION, message: ERROR_MESSAGES.EXCEPTION, e }, data: null };
  }
}
