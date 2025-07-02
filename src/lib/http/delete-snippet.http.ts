import * as z from 'zod/v4';
import { API_URL } from './const';
import type { TResult } from '~/types';
import { ERROR_TYPE_EXCEPTION, ERROR_TYPE_SERVER, MESSAGE_EXCEPTION, MESSAGE_PARSING_ERROR } from '~/app/const';
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
        error: { type: ERROR_TYPE_SERVER, message: MESSAGE_PARSING_ERROR, status: response.status },
        data: null,
      };
    }

    return {
      error: { type: ERROR_TYPE_SERVER, message: `Error deleting snippet`, status: response.status },
      data: null,
    };
  } catch (e) {
    return { error: { type: ERROR_TYPE_EXCEPTION, message: MESSAGE_EXCEPTION, e }, data: null };
  }
}
