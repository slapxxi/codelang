import * as z from 'zod/v4';
import { API_URL } from './const';
import { CommentSchema, UserSchema } from './schema';
import type { TResult, TComment } from '~/types';
import {
  ERROR_TYPE_EXCEPTION,
  ERROR_TYPE_SERVER,
  MESSAGE_EXCEPTION,
  MESSAGE_PARSING_ERROR,
  STATUS_SERVER,
} from '~/app/const';

const PostCommentResponse = z.object({
  ...CommentSchema.shape,
  user: UserSchema,
});

type Params = {
  snippetId: string;
  comment: string;
  token: string;
};

type Result = TResult<TComment>;

export async function postComment(params: Params): Promise<Result> {
  try {
    const url = new URL(`${API_URL}/comments`);
    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify({ snippetId: params.snippetId, content: params.comment }),
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${params.token}`,
      },
    });

    if (response.ok) {
      const json = await response.json();
      const { success, data } = PostCommentResponse.safeParse(json.data);
      if (success) {
        return { data, error: null };
      }

      return {
        error: { type: ERROR_TYPE_SERVER, message: MESSAGE_PARSING_ERROR, status: STATUS_SERVER },
        data: null,
      };
    }

    return { error: { type: ERROR_TYPE_SERVER, message: response.statusText, status: response.status }, data: null };
  } catch (e) {
    return { error: { type: ERROR_TYPE_EXCEPTION, message: MESSAGE_EXCEPTION, e }, data: null };
  }
}
